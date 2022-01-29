const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Content Contract constructor & setup", function () {

    beforeEach(async function () {
        accounts = await ethers.getSigners();  // 20 accounts
        owner = accounts[0]; // owner of contracts because it deployed them
        creator = accounts[1];
        pR1= accounts[2]; 
        pR2 = accounts[3]; 
        pR3 = accounts[4]; 
        pR4 = accounts[5]; 
        noncreator = accounts[6];

        AdminContract = await ethers.getContractFactory("AdminProxy");
        adminContract = await AdminContract.deploy();
        await adminContract.deployed(); 

        contentAddress = await adminContract.contentAddress();
        ContentContract = await ethers.getContractFactory("Content");
        contentContract = ContentContract.attach(contentAddress);

        SettingsContract = await ethers.getContractFactory("Settings");
        settingsAddress = await contentContract.settingsAddress();
        settingsContract = SettingsContract.attach(settingsAddress);

        bondingCurveAddress = await contentContract.bondingCurveAddress();
        BondingCurve = await ethers.getContractFactory("BondingCurve");
        bondingCurveContract = BondingCurve.attach(bondingCurveAddress);

        prAddress = await contentContract.PRsAddress();
        PullRequests = await ethers.getContractFactory("PullRequests");
        prContract = PullRequests.attach(prAddress);
    });

    it("should assert the owner (admin) of the contract", async function () {
        //contentContract = await ContentContract.deploy(adminContract.address, settingsContract.address, prContract.address, bondingCurve.address);
        //await contentContract.deployed();
        //expect(await contentContract.owner()).to.equal(owner.address);
    });

});

describe("Content Contract functions", function () {
    let ContentContract, contentContract;

    beforeEach(async function () {
        accounts = await ethers.getSigners();  // 20 accounts
        owner = accounts[0]; // owner of contracts because it deployed them
        creator1 = accounts[1];
        creator2 = accounts[2];
        pR1= accounts[3]; 
        pR2 = accounts[4]; 
        pR3 = accounts[5]; 
        pR4 = accounts[6]; 
        noncreator1 = accounts[7];
        noncreator2 = accounts[8];

        AdminContract = await ethers.getContractFactory("AdminProxy");
        adminContract = await AdminContract.deploy();
        await adminContract.deployed();

        contentAddress = await adminContract.contentAddress();
        ContentContract = await ethers.getContractFactory("Content");
        contentContract = ContentContract.attach(contentAddress);

        SettingsContract = await ethers.getContractFactory("Settings");
        settingsAddress = await contentContract.settingsAddress();
        settingsContract = SettingsContract.attach(settingsAddress);

        bondingCurveAddress = await contentContract.bondingCurveAddress();
        BondingCurve = await ethers.getContractFactory("BondingCurve");
        bondingCurveContract = BondingCurve.attach(bondingCurveAddress);

        prAddress = await contentContract.PRsAddress();
        PullRequests = await ethers.getContractFactory("PullRequests");
        prContract = PullRequests.attach(prAddress);

        // 
        // contentContract = await ContentContract.deploy(adminContract.address, settingsContract.address, prContract.address, bondingCurve.address);
        // await contentContract.deployed();
        ownerStake=5* 10**5;
        supply= 10**7;
        initialprice=ethers.BigNumber.from("100000000000000000");
        encoder = new TextEncoder();
        decoder = new TextDecoder();
        tempData = encoder.encode("hi I am your original content");
        prData1 = encoder.encode("I am PR one");
        prData2 = encoder.encode("I am PR two");
        tokensymbol = encoder.encode("HIITME");
        overridesWithETH = {
            value: ethers.utils.parseEther("1.0")
        };
        overridesWithETH_PR = {
            value: ethers.utils.parseEther("0.2")
        };

    });


    describe("creator new content", function () {
        
        it("should assert that new content created, author with correct stake", async function () {

            // first token to be minted will be 0 
            ownerToken = 0;
            await expect(contentContract.connect(creator).mint(
                tokensymbol, supply, ownerStake, initialprice, tempData, overridesWithETH))
            .to.emit(contentContract, "NewContentMinted").withArgs(ownerToken, creator.address);
            expect(await contentContract.balanceOf(creator.address, ownerToken)).to.equal(ownerStake);
            content0 = Buffer.from((await contentContract.contentData(ownerToken+1)).slice(2,), 'hex').toString('utf8');
            expect(content0).to.equal(decoder.decode(tempData));
        });

        it("should revert if ownerstake greater than supply", async function () {
            ownerStake = 4 * 10**8;
            await expect(contentContract.connect(creator).mint(
                tokensymbol, supply, ownerStake, initialprice, tempData, overridesWithETH))
            .to.be.revertedWith("Owner stake must be less than supply");

            //require(minPRPrice >= settings.MinimumPRPrice(), "Min PR Price is too low");
            //require(msg.value >= settings.MinimumInitialPrice(), "Not enough ETH to mint content");
            //require(totalSupply >= settings.MinimumTotalSupply(), "Total Supply too low");
        });


        it("should revert if PR price,initial price, or supply is too low", async function () {
            initialprice = 1000;
            await expect(contentContract.connect(creator).mint(
                tokensymbol, supply, ownerStake, initialprice, tempData, overridesWithETH))
            .to.be.revertedWith("Min PR Price is too low");
            // token supply is too low?
            // initial price is too low?
        });

        // it("should revert if owner stake too high", async function () {
            
        // });

        it("should assert that tokenID assigned to contract equals 1", async function () {
            await contentContract.connect(creator).mint(
                tokensymbol, supply, ownerStake, initialprice, tempData, overridesWithETH);
            expect(await contentContract.balanceOf(contentContract.address, 1)).to.equal(1);
        });
    
    });
    
    // PR submitted tests

    describe("PR submitted", function () {

        beforeEach(async function () {
            await contentContract.connect(creator).mint(
                tokensymbol, supply, ownerStake, initialprice, tempData, overridesWithETH);
        });

        it("should revert when not in PR window", async function () {
            tokenID = 1;
            await expect(contentContract.connect(pR1).submitPR(prData1, tokenID, overridesWithETH)
                ).to.be.revertedWith("Contributions are currently closed");
            // PR block timestamp within PR window 
        });

        it("should revert when submitting PR for nonexistent content", async function () {
            await adminContract.connect(owner).startContributionPeriod();
            tokenID = 3;
            await expect(contentContract.connect(pR1).submitPR(prData1, tokenID, overridesWithETH)).to.be.revertedWith("Content does not exist");
        });
        
        it("should update PRs when in PR window, for two people", async function () {           
            expect(await adminContract.connect(owner).startContributionPeriod()
                ).to.emit(adminContract, "ContributionsOpen").withArgs();
            tokenID = 1;
            // console.log(overridesWithETH_PR);
            await contentContract.connect(pR1).submitPR(prData1, tokenID, overridesWithETH);   // submit PR
            await contentContract.connect(pR2).submitPR(prData2, tokenID, overridesWithETH);
            
            // todo figure out bytes 
            hex = await prContract.getContent(pR1.address, tokenID);
            text = Buffer.from((await prContract.getContent(pR1.address, tokenID)).slice(2,), 'hex').toString('utf8');
            expect(text).to.equal(decoder.decode(prData1));    // check PR text is persisted
            text2 = Buffer.from((await prContract.getContent(pR2.address, tokenID)).slice(2,), 'hex').toString('utf8');
            expect(text2).to.equal(decoder.decode(prData2));
            expect(await prContract.getPRexists(pR1.address, tokenID)).to.equal(true);
            expect(await prContract.getPRexists(pR2.address, tokenID)).to.equal(true);
        });

    });



    // Voting tests

    describe("voting", function() {

        beforeEach(async function () {
            await contentContract.connect(creator).mint(
                tokensymbol, supply, ownerStake, initialprice, tempData, overridesWithETH);
            await adminContract.connect(owner).startContributionPeriod();
            
            // PRtext1 = "testPR uno";
            // PRtext2 = "testPR numba two";
            // tokenID = 1;
            await contentContract.connect(pR1).submitPR(prData1, tokenID, overridesWithETH);   // submit PR
            await contentContract.connect(pR2).submitPR(prData2, tokenID, overridesWithETH);
        });
        
        // should revert when not in voting window
        it("should revert when not in voting window", async function () {
            // await adminContract.connect(owner).startContributionPeriod();
            tokenID = 1;
            await expect(
                contentContract.connect(creator).vote(pR1.address, 1, true, tokenID)
            ).to.be.revertedWith("Cannot vote during contribution period");
        });

        // should revert when non-author tries to vote on some content
        it("should revert when non-author tries to vote", async function () {
            await adminContract.connect(owner).startVotingPeriod();

            await expect(
                contentContract.connect(noncreator).vote(PR1, 1, true)
            ).to.be.revertedWith("Non-authors not allowed to vote on PRs");
        });
        
        // should revert when author tries to cast more votes than they have
        it("should revert when author tries to cast more votes than they have available", async function () {
            await adminContract.connect(owner).startContributionPeriod();

            await adminContract.connect(owner).startVotingPeriod();
            await contentContract.connect(creator).vote(PR1, 1);
            await contentContract.connect(owner).approvePR(PR1); 
            await adminContract.connect(owner).startContributionPeriod();
            let PR2 = await contentContract.connect(pR1).submitPR("I am PR1");
            await adminContract.connect(owner).startVotingPeriod();
            await expect(
                contentContract.connect(creator).vote(PR2, 50)
            ).to.be.revertedWith("Not allowed to cast more votes than those available");
        });

        it("should revert when not in voting window", async function () {
            // await adminContract.connect(owner).startContributionPeriod();
            tokenID = 1;
            await expect(
                contentContract.connect(creator).vote("", 1, true)
            ).to.be.revertedWith("Cannot vote during contribution period");
        });
        
    });

    describe("approving PR", function () {
        beforeEach(async function () {
            await contentContract.connect(creator).mint(
                tokensymbol, supply, ownerStake, initialprice, tempData, overridesWithETH);
            //console.log(await contentContract.balanceOf(creator.address, 0))
            await adminContract.connect(owner).startContributionPeriod();
            // submit PR
            await contentContract.connect(pR1).submitPR(prData1, tokenID, overridesWithETH);   
            await contentContract.connect(pR2).submitPR(prData2, tokenID, overridesWithETH);

            function delay(ms) {
                return new Promise( resolve => setTimeout(resolve, ms) );
            }
            await delay(5000);

            await adminContract.connect(owner).startVotingPeriod();
        });

        it("should revert if not owner approving PR", async function () {
            tokenID = 0;
            await contentContract.connect(creator).vote(pR1.address, 1, true, tokenID);
            await delay(5000);
            await adminContract.connect(owner).endRound();
            await expect(adminContract.votingOpen()).to.be.eq(false);
            await expect(adminContract.contributionsOpen()).to.be.eq(false);


        });
    });

});
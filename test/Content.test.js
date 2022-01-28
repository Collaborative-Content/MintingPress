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
        SettingsContract = await ethers.getContractFactory("Settings");
        settingsContract = await SettingsContract.deploy();
        await settingsContract.deployed(); 

        AdminContract = await ethers.getContractFactory("AdminProxy");
        adminContract = await AdminContract.deploy(settingsContract.address);
        await adminContract.deployed(); 

        PullRequests = await ethers.getContractFactory("PullRequests");
        prContract = await PullRequests.deploy();
        await prContract.deployed(); 

        ContentContract = await ethers.getContractFactory("Content");
    });

    it("should assert the owner (admin) of the contract", async function () {
        contentContract = await ContentContract.deploy(adminContract.address, settingsContract.address, prContract.address);
        await contentContract.deployed();
        expect(await contentContract.owner()).to.equal(owner.address);
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
        SettingsContract = await ethers.getContractFactory("Settings");
        settingsContract = await SettingsContract.deploy();
        await settingsContract.deployed();

        AdminContract = await ethers.getContractFactory("AdminProxy");
        adminContract = await AdminContract.deploy(settingsContract.address);
        await adminContract.deployed();

        PullRequests = await ethers.getContractFactory("PullRequests");
        prContract = await PullRequests.deploy();
        await prContract.deployed();

        ContentContract = await ethers.getContractFactory("Content");
        contentContract = await ContentContract.deploy(adminContract.address, settingsContract.address, prContract.address);
        await contentContract.deployed();
        ownerStake=5* 10**5;
        supply= 10**7;
        initialprice=ethers.BigNumber.from("100000000000000000");
        encoder = new TextEncoder();
        tempData = encoder.encode("hi I'm your original content");
        tokensymbol = encoder.encode("HIITME");
        overridesWithETH = {
            value: ethers.utils.parseEther("1.0")
        };
    });


    describe("creator new content", function () {
        
        it("should assert that new content created, author with correct stake and content is correct", async function () {

            //await owner.sendTransaction({
                //         to: contract.address,
                //         value: ethers.utils.parseEther("1.0"),
                //       });
                
            // console.log(await contentContract.connect(creator).calculatePurchaseReturn(
            //     initialprice, creator.address, 2));

            await expect(contentContract.connect(creator).mint(tempData, supply, 
            initialprice, ownerStake, tokensymbol, overridesWithETH))
            .to.emit(contentContract, "NewContentMinted").withArgs(0, creator.address);
            expect(await contentContract.balanceOf(creator.address, 0)).to.equal(ownerStake);
            expect(await contentContract.contentData(contentToken)).to.equal(tempData);
        });

        it("should revert if ownerstake greater than supply", async function () {
            ownerStake = 4 * 10**8;
            await expect(contentContract.connect(creator).mint(tempData, 
            supply, initialprice, ownerStake, tokensymbol, overridesWithETH))
            .to.be.revertedWith("Owner stake must be less than supply");

            //require(minPRPrice >= settings.MinimumPRPrice(), "Min PR Price is too low");
            //require(msg.value >= settings.MinimumInitialPrice(), "Not enough ETH to mint content");
            //require(totalSupply >= settings.MinimumTotalSupply(), "Total Supply too low");
        });


        it("should revert if PR price,initial price, or supply is too low", async function () {
            initialprice = 1000;
            await expect(contentContract.connect(creator).mint(tempData, supply, 
            initialprice, ownerStake, tokensymbol, overridesWithETH))
            .to.be.revertedWith("Min PR Price is too low");
            // token supply is too low?
            // initial price is too low?
        });

        // it("should revert if owner stake too high", async function () {
            
        // });

        it("should assert that tokenID assigned to contract equals 1", async function () {
            await contentContract.connect(creator).mint(tempData, supply, initialprice, ownerStake, tokensymbol, overridesWithETH);
            expect(await contentContract.balanceOf(contentContract.address, 1)).to.equal(1);
        });
    
    });
    
    // PR submitted tests

    describe("PR submitted", function () {

        beforeEach(async function () {
            await contentContract.connect(creator).mint(tempData, supply, initialprice, ownerStake, tokensymbol, overridesWithETH);
        });

        it("should revert when not in PR window", async function () {
            PRtext = "testPR";
            tokenID = 1;
            expect(await contentContract.connect(creator).submitPR(PRtext, tokenID)
                ).to.be.revertedWith("Contributions are currently closed");
            // PR block timestamp within PR window 
        });
        
        it("should update PRs when in PR window, for two people", async function () {
            // TODO contributions not locked 
            
            // await adminContract.connect(account0).startContributionPeriod();
            // await expect(adminContract.isContributionsPeriod().to.equal(true));

            await adminContract.connect(owner).startContributionPeriod();
            PRtext1 = "testPR uno";
            PRtext2 = "testPR numba two";
            tokenID = 1;
            await contentContract.connect(pR1).submitPR(PRtext1, tokenID);   // submit PR
            await contentContract.connect(pR2).submitPR(PRtext2, tokenID);
            expect(await prContract.PRs()[tokenID][pR1].content()).to.equal(PRtext1);    // check PR text is persisted
            expect(await prContract.PRs()[tokenID][pR2].content()).to.equal(PRtext2);
            expect(await prContract.PRexists()[tokenID][pR1]).to.equal(true);
            expect(await prContract.PRexists()[tokenID][pR2]).to.equal(true);
            // PR block timestamp within PR window
        });

    });



    // Voting tests

    describe("voting", function() {

        beforeEach(async function () {
            await contentContract.connect(creator).mint(tempData, supply, initialprice, ownerStake, tokensymbol, overridesWithETH);
            await adminContract.connect(owner).startContributionPeriod();
            
            PRtext1 = "testPR uno";
            PRtext2 = "testPR numba two";
            tokenID = 1;
            await contentContract.connect(pR1).submitPR(PRtext1, tokenID);   // submit PR
            await contentContract.connect(pR2).submitPR(PRtext2, tokenID);
        });
        
        // should revert when not in voting window
        it("should revert when not in voting window", async function () {
            // await adminContract.connect(owner).startContributionPeriod();
            tokenID = 1;
            await expect(
                contentContract.connect(creator).vote(pR1, 1, true, tokenID)
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

});
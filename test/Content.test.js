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

        ContentContract = await ethers.getContractFactory("Content");
    });

    it("should assert the owner (admin) of the contract", async function () {
        contentContract = await ContentContract.deploy(adminContract.address, settingsContract.address);
        await contentContract.deployed();
        expect(await contentContract.owner()).to.equal(owner.address);
    });



});

describe("Content Contract functions", function () {
    let ContentContract, contentContract;

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

        ContentContract = await ethers.getContractFactory("Content");
        contentContract = await ContentContract.deploy(adminContract.address, settingsContract.address);
        await contentContract.deployed();
    });


    describe("creator new content", function () {
    
        // first author has exactly one ownership token
        it("should assert that new content created, author with correct stake and content is correct", async function () {
            ownerStake=10**5;
            supply= 10**18;
            initialprice=ethers.BigNumber.from("100000000000000000");
            await expect(contentContract.connect(creator).mint(bytes("hi I'm your original content"), supply, 
            initialprice, ownerStake, "HIITME"))
            .to.emit(contentContract, "NewContentMinted").withArgs(0, creator.address);
            expect(await contentContract.balanceOf(creator.address, 0)).to.equal(ownerStake);
            expect(await contentContract.contentData(contentToken)).to.equal("hi I'm your original content");
        });

        it("should revert if ownerstake greater than supply", async function () {
            ownerStake=10**5;
            supply=10**4;
            initialprice=ethers.BigNumber.from("100000000000000000");
            expect(await contentContract.connect(creator).mint(bytes("hi I'm your original content"), 
            supply, initialprice, ownerStake, "HIITME"))
            .to.be.revertedWith("Owner stake must be less than supply");

            //require(minPRPrice >= settings.MinimumPRPrice(), "Min PR Price is too low");
            //require(msg.value >= settings.MinimumInitialPrice(), "Not enough ETH to mint content");
            //require(totalSupply >= settings.MinimumTotalSupply(), "Total Supply too low");
        });


        it("should revert if PR price,initial price, or supply is too low", async function () {
            ownerStake=10**5;
            supply= 10**6;
            initialprice=ethers.BigNumber.from("100000000000000000");
            await expect(contentContract.connect(creator).mint(bytes("hi I'm your original content"), supply, 
            1000, ownerStake, "HIITME"))
            .to.be.revertedWith("Min PR Price is too low");
            // token supply is too low?
            // initial price is too low?
        });

        it("should revert if owner stake too high", async function () {
            await expect(ContentContract.deploy(adminContract.address, settingsContract.address, 
                "hi I'm your original content", creator.address, 100000, 10000, 1000))
                .to.be.revertedWith("Min PR Price is too low");
            // token supply is too low?
            // initial price is too low?
        });
    });
    
    // PR submitted tests

    describe("PR submitted", function () {
        
        it("should update PRs when in PR window", async function () {
            // TODO contributions not locked 
            
            // await adminContract.connect(account0).startContributionPeriod();
            // await expect(adminContract.isContributionsPeriod().to.equal(true));

            await adminContract.connect(owner).startContributionPeriod();
            PRtext = "testPR";
            await contentContract.connect(creator).submitPR(PRtext);
            
            expect(contentContract.PRs()[creator].content()).to.equal(PRtext);
            // PR block timestamp within PR window 
        });

        it("should revert when not in PR window", async function () {
            PRtext = "testPR";
            expect(await contentContract.connect(creator).submitPR(PRtext)
                ).to.be.revertedWith("Contributions are currently closed");
            // PR block timestamp within PR window 
        });

    });



    // Voting tests

    describe("voting", function() {
        
        // should revert when not in voting window
        it("should revert when not in voting window", async function () {
            // setup
            await adminContract.connect(owner).startContributionPeriod();
            // test
            await expect(
                contentContract.connect(creator).vote("", 1, true)
            ).to.be.revertedWith("Cannot vote during contribution period");
        });

        // should revert when non-author tries to vote on some content
        it("should revert when non-author tries to vote", async function () {
            // setup
            await adminContract.connect(owner).startContributionPeriod();
            let PR1 = await contentContract.connect(creator).submitPR("I am PR1");
            await adminContract.connect(owner).startVotingPeriod();
            // test
            await expect(
                contentContract.connect(noncreator).vote(PR1, 1, true)
            ).to.be.revertedWith("Non-authors not allowed to vote on PRs");
        });
        
        // should revert when author tries to cast more votes than they have
        it("should revert when author tries to cast more votes than they have available", async function () {
            // setup
            await adminContract.connect(owner).startContributionPeriod();
            let PR1 = await contentContract.connect(creator).submitPR("I am PR1");
            await adminContract.connect(owner).startVotingPeriod();
            await contentContract.connect(creator).vote(PR1, 1);
            await contentContract.connect(owner).approvePR(PR1); 
            await adminContract.connect(owner).startContributionPeriod();
            let PR2 = await contentContract.connect(pR1).submitPR("I am PR1");
            await adminContract.connect(owner).startVotingPeriod();
            // test
            await expect(
                contentContract.connect(creator).vote(PR2, 50)
            ).to.be.revertedWith("Not allowed to cast more votes than those available");
        });
        
    });

});
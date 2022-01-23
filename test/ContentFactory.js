const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContentFactory Contract", () => {
    let ContentFactory, contract;
    let totalSupply = 100000;
    let ownerStake = 50000;
    let startingPrice = 20000;
    let tokenName = "test";
    let tokenSymbol = "tst";
    let content = "some test content";
    let owner;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();
        ContentFactory = await ethers.getContractFactory("ContentFactory");
        contract = await ContentFactory.deploy(totalSupply, ownerStake, startingPrice, tokenName, tokenSymbol, content);
        await contract.deployed();
    });

    //it("emit greeting event when greet function is called", async () => {
    //    expect(contentFactory.test())
    //        .to
    //        .emit(contentFactory, "Greet")
    //        .withArgs("hello Test one!");
    //});

    it("Contract deploys succesfully", async () => {
      expect(await contract.signer.address).to.equals(owner.address);
    });

    it("Test if owner's stake is set to the total outstanding mapping ", async () => {
        let balances = await contract.getBalances(owner.address);
        expect(balances)
            .to
            .equals(ownerStake);
    });

    it("calculatePurchaseReturn function, when price < startingPrice", async () => {
      let price = 15000;
      await expect(contract.calculatePurchaseReturn(price)).to.be
      .revertedWith('Below the minimum value for the pull request');
    });
});





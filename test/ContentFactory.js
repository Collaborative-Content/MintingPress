const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContentFactory Contract", () => {
    let ContentFactory, contract;
    let totalSupply = 100000;
    let ownerStake = 5000;
    let startingPrice = 2;
    let tokenName = "test";
    let tokenSymbol = "tst";
    let content = "some test content";
    let owner;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();
        ContentFactory = await ethers.getContractFactory("ContentFactory");
        contract = await ContentFactory.deploy(totalSupply, ownerStake, startingPrice, tokenName, tokenSymbol, content);
    });

    //it("emit greeting event when greet function is called", async () => {
    //    expect(contentFactory.test())
    //        .to
    //        .emit(contentFactory, "Greet")
    //        .withArgs("hello Test one!");
    //});

    it("Test if owner's stake is set to the total outstanding mapping ", async () => {
        let balances = await contract.getBalances(owner.address);
        expect(balances)
            .to
            .equals(ownerStake);
    });
});





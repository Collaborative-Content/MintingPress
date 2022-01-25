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
        console.log(contract._reserveCounter);
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

    /*it("Send money to the contract and see if ReceivedMoney event is emitted ", async () => {
      await owner.sendTransaction({
        to: contract.address,
        value: ethers.utils.parseEther("1.0"),
      });
      expect(contract.receive()).to
      .emit(contract, "ReceivedMoney")
      .withArgs(owner.address, ethers.util.parseEther("1.0"));
    });*/

    it("calculatePurchaseReturn: When price < startingPrice", async () => {
      let price = 15000;

      await expect(contract.calculatePurchaseReturn(price)).to.be
      .revertedWith('Below the minimum value for the pull request');
    });

    it("calculatePurchaseReturn: price=25000", async () => {
      let price = 25000;
      expect(contract.calculatePurchaseReturn(price)).to.be
      .equals(11237);
    });

});





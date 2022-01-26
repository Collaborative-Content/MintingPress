const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContentFactory Contract", () => {
    let ContentFactory, contract;
    let totalSupply;
    let ownerStake;
    let startingPrice;
    let tokenName;
    let tokenSymbol;
    let content;
    let owner, address1, address2, address3;

    beforeEach(async () => {
        totalSupply = 100000;
        ownerStake = 50000;
        startingPrice = 20000;
        tokenName = "test";
        tokenSymbol = "tst";
        content = "some test content";
        [owner, address1, address2, address3] = await ethers.getSigners();
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
        let balances = await contract.balanceOf(owner.address, 0);
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

    describe("Bonding Curve Function Test Cases:", () => {

      it("calculatePurchaseReturn: When price < startingPrice", async () => {
        let price = 15000;
  
        await expect(contract.calculatePurchaseReturn(price, owner.address)).to.be
        .revertedWith('Below the minimum value for the pull request');
      });

      it("should return for price=25000 tokens=11237", async ()=> {
        totalSupply = 100000;
        ownerStake = 50000;
        startingPrice = 20000;
        tokenName = "test";
        tokenSymbol = "tst";
        content = "some test content";
        let price = 25000;
        
        contract.setValues(totalSupply, ownerStake, startingPrice, tokenName, tokenSymbol, content);
        expect(contract.calculatePurchaseReturn(price, owner.address))
        .to.emit(contract, "Tokens")
        .withArgs(0);
      });
  
      it("totalSupply = 10000000, creatorStake = 3000000, price=2500000000 returns Tokens greater than available supply", async () =>{
        totalSupply = 10000000;
        ownerStake = 3000000;
        startingPrice = 20000;
        tokenName = "test";
        tokenSymbol = "tst";
        content = "some test content";
        let price = 2500000000;
        contract.setValues(totalSupply, ownerStake, startingPrice, tokenName, tokenSymbol, content);
        expect(await contract.calculatePurchaseReturn(price, owner.address))
        .to.emit(contract, "Tokens")
        .withArgs(1561000000);
      });
    });

    describe("Assignment of Tokens from the Bonding Curve", () => {
      it("Price=2500000, creatorStake=5000000, TotalSupply=1000000", async () => {
        totalSupply = 10000000;
        ownerStake = 3000000;
        startingPrice = 20000;
        tokenName = "test";
        tokenSymbol = "tst";
        content = "some test content";
        let price = 2500000000;
        contract.setValues(totalSupply, ownerStake, startingPrice, tokenName, tokenSymbol, content);
        await contract.calculatePurchaseReturn(price, address1.address);
        let balanceof = await contract.balanceOf(address1.address, 0);
        expect(balanceof)
        .to
        .equals(1561000000);
      });
    })
});
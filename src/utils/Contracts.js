import { ADMIN_ADDR, SETTINGS_ADDR, CONTENT_ADDR, BC_ADDR, PRS_ADDR } from "../constants";
import { ethers } from 'ethers';
import { getContract, getSelectedAddress, requestAccount } from "./common";
import AdminArtifact from "../abis/AdminProxy.json";
import SettingsArtifact from "../abis/Settings.json";
import ContentArtifact from "../abis/Content.json";
import BCArtifact from "../abis/BondingCurve.json";
import PRsArtifact from "../abis/PullRequests.json";
import {v4} from "uuid";

function getAdminContract() {
    return getContract(ADMIN_ADDR, AdminArtifact);
}

function getSettingsContract() {
    return getContract(SETTINGS_ADDR, SettingsArtifact);
}

function getContentContract() {
    return getContract(CONTENT_ADDR, ContentArtifact);
}

function getBondingCurveContract() {
    return getContract(BC_ADDR, BCArtifact);
}

function getPullRequestsContract() {
    return getContract(PRS_ADDR, PRsArtifact);
}

async function startContributionPeriod() {
    console.log("starting contribution period");
    const adminContract = getAdminContract();
    console.log("admin contract is ", adminContract);
    console.log("admin contract address is ", adminContract.address);

    const account = await getSelectedAddress();
    console.log("account to connect: ", account);

    let response = await adminContract.startContributionPeriod();
    console.log(response);
}

async function startVotingPeriod() {
    console.log("starting voting period");
    const adminContract = getAdminContract();
    console.log("admin contract is ", adminContract);
    console.log("admin contract address is ", adminContract.address);

    const account = await getSelectedAddress();
    console.log("account to connect: ", account);

    let response = await adminContract.startVotingPeriod();
    console.log(response);
}

async function endRound() {
    console.log("ending round");
    const adminContract = getAdminContract();
    console.log("admin contract is ", adminContract);
    console.log("admin contract address is ", adminContract.address);

    const account = await getSelectedAddress();
    console.log("account to connect: ", account);

    let response = await adminContract.endRound();
    console.log(response);
}

async function mint(tokensymbol, supply, ownerStake, PRprice, story, value) {
    console.log("Minting Story", { tokensymbol, supply, ownerStake, PRprice, story, value });
    const contract = getContentContract();
    console.log(contract);
    console.log(contract.address);

    const account = await getSelectedAddress();
    console.log("account to connect: ", account);
    const encoder = new TextEncoder();
    const tempData = encoder.encode(story);
    const symbolData = encoder.encode(tokensymbol);
    
    const overridesWithETH = {
        value: value
    };
    let response = await contract.mint(
        symbolData, supply, ownerStake, PRprice, tempData, overridesWithETH
    );
    console.log(response);
    console.log("Balance of account ", account, ": ", contract.balanceOf(account, 0));
}

function getFirstContent() {
    console.log("Getting first piece of content");
    const contract = getContentContract();
    console.log(contract);

    let firstContent = contract.getContent(1);
    console.log("First piece of content: ", firstContent);
    return firstContent;
}

async function getContent() {
    console.log("Getting content");
    const contract = getContentContract();
    //console.log(contract);
    const bondingCurve = getBondingCurveContract();

    const account = (await getSelectedAddress());
    console.log("account to connect: ", account);
    // need name, story, id
    const contentTokenId = (await contract.contentTokenID()).toNumber();
    console.log("token id: ", contentTokenId);
    let allContent = new Array();
    for (let i=1; i<contentTokenId; i=i+2) {
        let newcontent = {
            "story": (await contract.getContent(i)).toString(),
            "id":   v4(),
            "name": (await bondingCurve.getTokenSymbol(i-1)).toString()
        };
        allContent.push(newcontent);
    }
    console.log(allContent);
    return allContent;
}

async function getVotes(tokenID, address) {
    const contract = getContentContract();
    let credits = await contract.voteCredits(tokenID, address);
    console.log(credits);
    return credits;
}

export { getAdminContract, 
         getSettingsContract, 
         getContentContract, 
         getBondingCurveContract, 
         getPullRequestsContract,
         startContributionPeriod,
         startVotingPeriod,
         endRound,
         mint,
         getFirstContent,
         getVotes,
         getContent }

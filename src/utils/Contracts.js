import { ADMIN_ADDR, SETTINGS_ADDR, CONTENT_ADDR, BC_ADDR, PRS_ADDR } from "../constants";
import { ethers } from 'ethers';
import { getContract, requestAccount } from "./common";
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

async function mint(tokensymbol, supply, ownerStake, PRprice, story, value) {
    console.log("Minting Story", { tokensymbol, supply, ownerStake, PRprice, story, value });
    const contract = getContentContract();
    console.log(contract);
    console.log(contract.address);

    const account = 
    //await requestAccount();
    console.log("account to connect: ", account);
    const encoder = new TextEncoder();
    const tempData = encoder.encode(story);
    
    const overridesWithETH = {
        value: value
    };
    let response = await contract.connect(account).mint(
        tokensymbol, supply, ownerStake, PRprice, tempData, overridesWithETH
    );
    console.log(response);
}

function getFirstContent() {
    console.log("Getting first piece of content");
    const contract = getContentContract();
    console.log(contract);

    let firstContent = contract.getContent(1);
    console.log("First piece of content: ", firstContent);
    return firstContent;
}

async function getContentState() {
    console.log("Getting content");
    const contract = getContentContract();
    console.log(contract);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let account = requestAccount();
    // need name, story, id
    let contentTokenId = await contract.connect(account).contentTokenId().toString();
    let allContent = [];
    for (let i=1; i<contentTokenId; i=i+2) {
        let newcontent = {
            "story": await contract.connect(account).getContent(i).toString(),
            "id":   v4(),
            "name": "STORY"
        };
        allContent.push(newcontent)
    }
    if (!allContent) {
        allContent = [{}];
    }
    return allContent;
}

async function getVotes(tokenID, address) {
    const contract = getContentContract();
    let credits = await contract.voteCredits(tokenID, address);
    return credits;
}

export { getAdminContract, 
         getSettingsContract, 
         getContentContract, 
         getBondingCurveContract, 
         getPullRequestsContract, 
         mint, 
         getFirstContent,
         getVotes,
         getContentState }

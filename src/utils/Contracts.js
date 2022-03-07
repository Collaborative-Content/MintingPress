import { ADMIN_ADDR, SETTINGS_ADDR, CONTENT_ADDR, BC_ADDR, PRS_ADDR } from "../constants";
import { getContract, requestAccount } from "./common";
import AdminArtifact from "../abis/AdminProxy.json"
import SettingsArtifact from "../abis/Settings.json"
import ContentArtifact from "../abis/Content.json"
import BCArtifact from "../abis/BondingCurve.json"
import PRsArtifact from "../abis/PullRequests.json"

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

function mint(tokensymbol, supply, ownerStake, initialprice, story, value) {
    console.log("Minting Story", { tokensymbol, supply, ownerStake, initialprice, story, value });
    const contract = getContentContract();
    console.log(contract);

    const response = contract.mint(
        tokensymbol, supply, ownerStake, initialprice, story
    );
    console.log(response);

    // const encoder = new TextEncoder();
    // const tempData = encoder.encode(story);
    
    // const account = requestAccount();
    // const overridesWithETH = {
    //     value: value
    // };
    // contract.connect(account).mint(
    //     tokensymbol, supply, ownerStake, initialprice, tempData, overridesWithETH)
}

function getFirstContent() {
    console.log("Getting first piece of content");
    const contract = getContentContract();
    console.log(contract);

    let firstContent = contract.getContent(1);
    console.log("First piece of content: ", firstContent);
    return firstContent;
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
         mint, 
         getFirstContent,
         getVotes }
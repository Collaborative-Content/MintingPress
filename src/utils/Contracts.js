import { ADMIN_ADDR, CONTENT_ADDR } from "../constants";
import { getContract, requestAccount } from "./common";
import ContentArtifact from "../abis/Content.json"
import AdminArtifact from "../abis/AdminProxy.json"

function getContentContract() {
    return getContract(CONTENT_ADDR, ContentArtifact);
}

function getAdminContract() {
    return getContract(ADMIN_ADDR, AdminArtifact);
}

function mint(tokensymbol, supply, ownerStake, initialprice, story, value) {
    encoder = new TextEncoder();
    tempData = encoder.encode(story);
    contract = getContentContract();
    account = requestAccount();
    overridesWithETH = {
        value: value
    };
    await expect(contract.connect(account).mint(
        tokensymbol, supply, ownerStake, initialprice, tempData, overridesWithETH))
}
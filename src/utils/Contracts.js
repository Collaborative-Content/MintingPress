import { ADMIN_ADDR, CONTENT_ADDR } from "../constants";
import { getContract } from "./common";
import ContentArtifact from "../abis/Content.json"
import AdminArtifact from "../abis/AdminProxy.json"

function getContentContract() {
    return getContract(CONTENT_ADDR, ContentArtifact);
}

function getAdminContract() {
    return getContract(ADMIN_ADDR, AdminArtifact);
}
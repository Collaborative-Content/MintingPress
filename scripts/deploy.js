const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const AdminProxy = await hre.ethers.getContractFactory("AdminProxy");
    const adminProxy = await AdminProxy.deploy();
    await adminProxy.deployed();
    console.log("Admin Proxy address: ", adminProxy.address);

    settingsAddress = await adminProxy.settingsAddress();
    console.log("Settings address: ", settingsAddress);
    const SettingsContract = await hre.ethers.getContractFactory("Settings");
    const settingsContract = SettingsContract.attach(settingsAddress);

    contentAddress = await adminProxy.contentAddress();
    console.log("Content address: ", contentAddress);
    const ContentContract = await hre.ethers.getContractFactory("Content");
    const contentContract = ContentContract.attach(contentAddress);

    bondingCurveAddress = await contentContract.bondingCurveAddress();
    console.log("Bonding Curve address: ", bondingCurveAddress);
    const BondingCurveContract = await hre.ethers.getContractFactory("BondingCurve");
    const bondingCurveContract = BondingCurveContract.attach(bondingCurveAddress);

    prsAddress = await contentContract.PRsAddress();
    console.log("Pull Requests address: ", prsAddress);
    const PRsContract = await hre.ethers.getContractFactory("PullRequests");
    const prsContract = PRsContract.attach(prsAddress);

    saveFrontendFiles(adminProxy, "AdminProxy");
    saveFrontendFiles(settingsContract, "Settings");
    saveFrontendFiles(contentContract, "Content");
    saveFrontendFiles(bondingCurveContract, "BondingCurve");
    saveFrontendFiles(prsContract, "PullRequests");

}

function saveFrontendFiles(contract, contractName) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../src/abis";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    // shitty af code but it's 1:12 in the morning
    if (contractName == "AdminProxy") {
        fs.writeFileSync(

            contractsDir + "/" + contractName + "-address.json",
            JSON.stringify({ AdminProxy: contract.address }, undefined, 2)
        );
    } else if (contractName == "Settings") {
        fs.writeFileSync(

            contractsDir + "/" + contractName + "-address.json",
            JSON.stringify({ Settings: contract.address }, undefined, 2)
        );
    } else if (contractName == "Content") {
        fs.writeFileSync(

            contractsDir + "/" + contractName + "-address.json",
            JSON.stringify({ Content: contract.address }, undefined, 2)
        );
    } else if (contractName == "BondingCurve") {
        fs.writeFileSync(

            contractsDir + "/" + contractName + "-address.json",
            JSON.stringify({ BondingCurve: contract.address }, undefined, 2)
        );
    } else if (contractName == "PullRequests") {
        fs.writeFileSync(

            contractsDir + "/" + contractName + "-address.json",
            JSON.stringify({ PullRequests: contract.address }, undefined, 2)
        );
    }
    

    const contractArtifact = artifacts.readArtifactSync(contractName);

    fs.writeFileSync(
        contractsDir + "/" + contractName + ".json",
        JSON.stringify(contractArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
import { ethers } from 'ethers';

async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
}

function getContract(contractAddr, artifact) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddr, artifact.abi, signer);

    return contract;
}

async function getSelectedAddress() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return await signer.getAddress();
}

export { requestAccount, getContract, getSelectedAddress }
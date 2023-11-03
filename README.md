# MintingPress

Text-based media and content creation are not always single-sourced. Often it takes multiple creators to build a great story. What’s more, many of these creators may only be reachable via the network effects of the internet.

Typically, writers fully complete a piece before monetizing it, as is the case with books, traditional news journalism, or even Substack. Other types of online text-based media that often are collaborative, like Reddit posts around topics of shared interest, go unmonetized. 

What if Reddit threads could be fully monetized? With the power of Ethereum, we can now use NFTs to encourage anonymous writer collaboration on shared stories and bring economic benefit to creators each step of the way. In any written media, content creators can often build something even more resonant when they’re working together; and through pull request approval they can keep the idea true to their original intent.

The goals of MintingPress are simple:
1. Foster collaboration among like minded individuals
2. Compensate authors fairly based on the magnitude and timing of their contributions
3. Preserve and even augment the creative process

Happy Minting!

-----------------------------------------------------------------------------------------------------------------------------------------------------------

#### Click to watch the Demo Video:
[![Minting Press - Demo Video](https://img.youtube.com/vi/amBGfcn4lTQ/maxresdefault.jpg)](https://youtu.be/amBGfcn4lTQ)


#### Click to watch the Launch Video:
[![Minting Press - Launch Video](https://img.youtube.com/vi/DywDGOteBPY/maxresdefault.jpg)](https://youtu.be/DywDGOteBPY)

-----------------------------------------------------------------------------------------------------------------------------------------------------------

## To get this up and running locally

Clone this repo. From directory `MintingPress`:
- `npx hardhat compile` to compile the smart contracts
- `npx hardhat node` to set up a blockchain on localhost network, and create accounts with balances
- `npx hardhat run --network localhost scripts/deploy.js` to deploy the smart contracts to ^ blockchain
-  copy paste smart contract addresses from ^ into `src/constants.js`
-  `npm start` to run the react app

## Additional functionality
- `npx hardhat console` to open up a CLI with the smart contracts
- `npx hardhat test` to run the unit test suite in `test/Content.test.js`

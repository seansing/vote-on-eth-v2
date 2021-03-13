## Welcome to Vote-On-Eth V2!

Vote-On-Eth is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

As the smart contracts used live on the Rinkeby testnet, ensure that you have some test Rinkeby Ether which you can get from the faucet [here](https://faucet.rinkeby.io/).

It also utilizes Zeenus Tokens as its voting mechanisms. Instructions for users to obtain ZEENUS is described in the landing page of the dApp.

## Getting Started

Once you have cloned the repo, run:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dApp in action!

## Smart Contracts

Hardhat was used to compile and deploy the smart contracts. The compiled artifacts are already included in this repo but if you would like see Hardhat in action, follow the steps below:

From the root folder :

```bash
cd ethereum
npx hardhat compile
```

Tests have not been written for Hardhat yet at this point of time. Do check back later!

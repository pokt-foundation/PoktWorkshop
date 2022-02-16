# Ethereum and Pocket Network

Covers an example of interacting with a simple
[ERC-1155](https://eips.ethereum.org/EIPS/eip-1155) contract. The contract is
currently deployed on Ethereum's mainnet at
[0x99cd83938B953EA2C77944f5cF1c483D25CB71B0](https://etherscan.io/address/0x99cd83938b953ea2c77944f5cf1c483d25cb71b0).
For a short period after build sessions geared towards Ethereum, a new item
will be made available to be claimed. Users who follow along will the have
opportunity to sign up for the free tier at the portal, come to these reference
examples, and use them in conjunction with the endpoint to mint themselves a
token for building along with that session.

## Overview

- `python`: Provides a jupyter notebook for interacting with the deployed contract through Pocket Network.
- `react`: Provides a simple react app for interacting with the deployed contract through MetaMask and Pocket Network.
- `solidity`: Includes the smart contract implementation of the ERC-1155, as well as a sample truffle configuration for deploying contracts with Pocket Network.
- `slides`: Includes any slides used build sessions.
- `items`: The metadata and images currently associated with the uri of the ERC-1155.
- `install_contracts.sh`: A helper script for quickly copying ABI from truffle's build to the `react` and `python` interfaces

import { ethers } from "ethers";
import { readFile } from "fs/promises";

// ERC-1155 (number of different tokens with ids, each id has a supply)
const PoktWorkshop = JSON.parse(await readFile("./PoktWorkshop.json"));

const address = "0x99cd83938B953EA2C77944f5cF1c483D25CB71B0";

// Pocket RPC Provider (Our RPC data happens with Pocket)
const web3 = new ethers.providers.JsonRpcProvider(
  "https://eth-mainnet.gateway.pokt.network/v1/lb/YOURENDPOINTHERE"
);

const contract = new ethers.Contract(address, PoktWorkshop.abi, web3);

const supply = await contract.totalSupply(1);
const uri = await contract.uri(1);

console.log(uri);

/*
NOTE: Will not work in node console.

// Meta Mask RPC Provider (Our RPC data and transaction signer happens with Metamask)
const metamaskWeb3 = new ethers.providers.Web3Provider(window.ethereum)
// Is used for signing our transactions with MetaMask
const metaMaskSigner = metamaskWeb3.getSigner()

// This cannot send transactions directly, but can construct and sign them with MetaMask
const contractMM = new ethers.Contract(address, PoktWorkshop.abi, metaMaskSigner);

await contract.claim();
*/

import PoktWorkshop from "./contracts/PoktWorkshop.json";
import MetaMaskButton from "./components/ConnectMetaMaskButton";
import CollectionStatus from "./components/CollectionStatus";
import AccountStatus from "./components/AccountStatus";
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { useCallback, useEffect, useState } from "react";
import logo from "./assets/logo.svg";
import { Main } from "@pokt-foundation/ui";
import "./App.css";

const RPC_URL = "http://127.0.0.1:8545/";
const WORKSHOP = "0xD9fd477eb8f5E7Dc60a29634288045a40099A7f1";

function App() {
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [block, setBlock] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [signer, setSigner] = useState(null);
  const [id, setId] = useState(0);
  const [uri, setURI] = useState(null);

  const sendTx = useCallback(async () => {
    const send_c = new ethers.Contract(WORKSHOP, PoktWorkshop.abi, signer);
    const tx = await send_c.claim();
  }, [signer]);

  useEffect(() => {
    setWeb3(new ethers.providers.JsonRpcProvider(RPC_URL));
    setSigner(new ethers.providers.Web3Provider(window.ethereum).getSigner());
  }, [setWeb3, setSigner]);

  useEffect(() => {
    let isMounted = true;
    const getBlock = async () => {
      if (web3 !== null) {
        const b = await web3.getBlockNumber();
        if (isMounted) {
          setBlock(b);
        }
      }
    };
    getBlock();
    return () => {
      isMounted = false;
    };
  }, [setBlock, web3]);

  useEffect(() => {
    if (web3 !== null && signer !== null) {
      const c = new ethers.Contract(WORKSHOP, PoktWorkshop.abi, web3);
      setContract(c);
    }
  }, [setContract, web3, signer]);

  useEffect(() => {
    let isMounted = true;
    const getID = async () => {
      if (contract !== null) {
        const lastId = await contract.lastClaimableId();
        if (isMounted) {
          setId(lastId);
        }
      }
    };
    getID();
    return () => {
      isMounted = false;
    };
  }, [contract, setId]);

  useEffect(() => {
    let isMounted = true;
    const getURI = async () => {
      if (contract !== null) {
        const c_uri = await contract.uri(BigNumber.from(0));
        if (isMounted) {
          setURI(c_uri);
        }
      }
    };
    getURI();
    return () => {
      isMounted = false;
    };
  }, [contract, setURI]);

  return (
    <Main>
      <div className="App">
        <header className="App-header">
          <h2>Pocket Network</h2>
          <div className="Logo-container">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <h3>EthDenver 2022 Builders Workshop</h3>
          {accounts.length === 0 ? (
            <MetaMaskButton accounts={accounts} setAccounts={setAccounts} />
          ) : (
            <div className="Content">
              <CollectionStatus
                workshopContract={contract}
                metadataURI={uri}
                currentBlock={block}
                currentId={id}
                account={accounts[0]}
                claimTxCallback={sendTx}
              />
              <AccountStatus
                workshopContract={contract}
                metadataURI={uri}
                currentBlock={block}
                account={accounts[0]}
                currentId={id}
              />
            </div>
          )}
        </header>
      </div>
    </Main>
  );
}

export default App;

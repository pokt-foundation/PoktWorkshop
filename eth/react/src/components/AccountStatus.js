import { useState, useEffect } from "react";
import ItemDisplay from "./ItemDisplay";
import { BigNumber } from "@ethersproject/bignumber";

const AccountStatus = ({
  workshopContract,
  metadataURI,
  currentBlock,
  account,
  currentId,
}) => {
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    setBalances(new Array(currentId).fill(0));
  }, [currentId, setBalances]);

  useEffect(() => {
    let isMounted = true;
    const getBalances = async () => {
      const newBals = [...balances];
      for (var i = currentId; i > 0; i--) {
        const bal = await workshopContract.balanceOf(
          account,
          BigNumber.from(i)
        );
        console.log(i - 1, bal.toNumber());
        newBals[i - 1] = bal.toNumber();
      }
      if (isMounted) {
        setBalances(newBals);
      }
    };
    getBalances();
    return () => {
      isMounted = false;
    };
  }, [currentId, account, currentBlock, workshopContract, setBalances]);

  return (
    <div className="items-container">
      <h3>Current Collection</h3>
      {balances.map((balance, i) => {
        if (balance > 0) {
          return (
            <ItemDisplay
              workshopContract={workshopContract}
              id={i + 1}
              metadataURI={metadataURI}
              currentBlock={currentBlock}
              balance={balance}
              key={i}
            />
          );
        } else {
          return <div key={i}></div>;
        }
      })}
    </div>
  );
};

export default AccountStatus;

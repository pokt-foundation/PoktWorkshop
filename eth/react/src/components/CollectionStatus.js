import { useState, useEffect } from "react";
import ItemDisplay from "./ItemDisplay";
import { BigNumber } from "@ethersproject/bignumber";

const CollectionStatus = ({
  workshopContract,
  metadataURI,
  currentBlock,
  currentId,
  account,
  claimTxCallback,
}) => {
  const [isClaimable, setIsClaimable] = useState(false);
  const [claimableBlocks, setClaimableBlocks] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const getClaimable = async () => {
      if (workshopContract !== null) {
        const anyClaimable = await workshopContract.anythingClaimable();
        const alreadyHas = await workshopContract.balanceOf(
          account,
          BigNumber.from(currentId)
        );
        let claimable;
        if (anyClaimable) {
          if (alreadyHas.toNumber() === 0) {
            claimable = true;
          } else {
            claimable = false;
          }
        } else {
          claimable = false;
        }
        if (isMounted) {
          setIsClaimable(claimable);
        }
      }
    };
    getClaimable();
    return () => {
      isMounted = false;
    };
  }, [account, currentId, currentBlock, workshopContract, setIsClaimable]);

  useEffect(() => {
    let isMounted = true;
    const getBlocks = async () => {
      const blocks = await workshopContract.claimableFor();
      if (isMounted) {
        setClaimableBlocks(blocks.toNumber());
      }
    };
    getBlocks();
    return () => {
      isMounted = false;
    };
  }, [currentBlock, workshopContract, setClaimableBlocks]);

  if (isClaimable) {
    return (
      <div className="claimable-container">
        <h3 className="claimable-title">Currently Avaiable:</h3>
        <ItemDisplay
          workshopContract={workshopContract}
          id={currentId}
          metadataURI={metadataURI}
          balance={null}
          currentBlock={currentBlock}
        />
        <p className="claimable-duration">
          Available for the next {claimableBlocks} blocks.
        </p>
        <button className="claimable-button" onClick={claimTxCallback}>
          Claim
        </button>
      </div>
    );
  } else {
    return <h3 className="claimable-title"> Nothing Avaiable to Claim</h3>;
  }
};

export default CollectionStatus;

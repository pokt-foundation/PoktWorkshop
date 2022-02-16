import { useState, useEffect } from "react";
import { BigNumber } from "@ethersproject/bignumber";

const ItemDisplay = ({
  workshopContract,
  id,
  metadataURI,
  currentBlock,
  balance,
}) => {
  const [itemURI, setItemURI] = useState(null);
  const [itemAlt, setItemAlt] = useState("Item");
  const [itemSupply, setItemSupply] = useState(0);
  const [itemMetadata, setMetadata] = useState(null);

  useEffect(() => {
    setItemAlt("Pokt Workshop Item #" + String(id));
  }, [id, setItemAlt]);

  useEffect(() => {
    if (metadataURI !== null) {
      const uri = metadataURI.replace(/({id})/, id);
      setItemURI(uri);
    }
  }, [id, metadataURI, setItemURI, currentBlock]);

  useEffect(() => {
    let isMounted = true;
    const getSupply = async () => {
      const supply = await workshopContract.totalSupply(BigNumber.from(id));
      if (isMounted) {
        setItemSupply(supply.toNumber());
      }
    };
    getSupply();
    return () => {
      isMounted = false;
    };
  }, [id, workshopContract, setItemSupply, currentBlock]);

  useEffect(() => {
    let isMounted = true;
    const getMetadata = async () => {
      if (itemURI !== null) {
        const response = await fetch(itemURI, { mode: "no-cors" });
        const metadata = await response.json();
        if (isMounted) {
          setMetadata(metadata);
        }
      }
    };
    getMetadata();
    return () => {
      isMounted = false;
    };
  }, [itemURI, setMetadata, currentBlock]);

  if (itemMetadata !== null) {
    return (
      <div className="item-display">
        <h5 className="item-title">{itemMetadata.title}</h5>
        <figure>
          <img
            src={itemMetadata.image}
            width={250}
            height={250}
            alt={itemAlt}
            className="item-img"
          />
          <figcaption className="item-caption">
            {itemMetadata.description}
          </figcaption>
        </figure>
        {balance !== null ? (
          <p className="item-balance">
            {balance} of {itemSupply}
          </p>
        ) : (
          <p className="item-balance">Total Supply: {itemSupply}</p>
        )}
      </div>
    );
  } else {
    return <></>;
  }
};

export default ItemDisplay;

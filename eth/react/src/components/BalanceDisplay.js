import { useState, useEffect } from "react";

const ItemBalance = ({
  workshopContract,
  id,
  account,
  supply,
  currentBlock,
}) => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const bal = workshopContract.balanceOf(account, id);
    setBalance(bal);
  }, [workshopContract, id.account, currentBlock]);

  return (
    <>
      <p className="item-balance">
        {balance} of {supply}
      </p>
    </>
  );
};

export default ItemBalance;

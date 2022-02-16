advanceBlock = () => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_mine",
        id: new Date().getTime(),
      },
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
};

advanceBlocks = async (n) => {
  for (i = 0; i < n; i++) {
    await advanceBlock();
  }
  return;
};

module.exports = { advanceBlocks };

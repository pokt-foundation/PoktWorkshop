const { advanceBlocks } = require("./helpers/advance");

describe("advanceBlocks helper function", async () => {
  it("should advance by 1 block", async () => {
    const block_0 = await web3.eth.getBlockNumber();

    await advanceBlocks(1);

    const block_1 = await web3.eth.getBlockNumber();

    const blockDiff = block_1 - block_0;
    assert.equal(blockDiff, 1, "Didn't advance by 1 block.");
  });
  it("should advance by 10 blocks", async () => {
    const block_0 = await web3.eth.getBlockNumber();

    await advanceBlocks(10);

    const block_10 = await web3.eth.getBlockNumber();

    const blockDiff = block_10 - block_0;
    assert.equal(blockDiff, 10, "Didn't advance by 1 block.");
  });
});

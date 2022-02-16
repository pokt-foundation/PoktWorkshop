const PoktWorkshop = artifacts.require("PoktWorkshop");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(
    PoktWorkshop,
    "https://poktworkshop.s3.us-east-2.amazonaws.com/{id}.json",
    "0xF6928C4780b85FEeDb49F2EF4569dc7Fa6547988"
  );
  pokt = await PoktWorkshop.deployed();
};

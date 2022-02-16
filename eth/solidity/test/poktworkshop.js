const PoktWorkshop = artifacts.require("PoktWorkshop");

const WORKSHOP_ROLE = web3.utils.soliditySha3("WORKSHOP_ROLE");

const { expectRevert } = require("@openzeppelin/test-helpers");

contract("PoktWorkshop initial behavior", async (accounts) => {
  it("should give the deployer the WORKSHOP_ROLE", async () => {
    const instance = await PoktWorkshop.deployed();
    const deployerHasWorkshop = await instance.hasRole(
      WORKSHOP_ROLE,
      accounts[0]
    );
    assert.isTrue(
      deployerHasWorkshop,
      "The deployer does not initially have the workshop role."
    );
  });
  it("should have no other accounts with the WORKSHOP_ROLE", async () => {
    const instance = await PoktWorkshop.deployed();
    const workshopOwnerCount = await instance.getRoleMemberCount(WORKSHOP_ROLE);
    assert.equal(
      workshopOwnerCount.valueOf(),
      1,
      "There was more than 1 initial workshop owner."
    );
  });
  it("should initially have nothing claimable", async () => {
    const instance = await PoktWorkshop.deployed();
    const anyClaimable = await instance.anythingClaimable();
    assert.isFalse(anyClaimable, "Something actually was claimable");
  });
  it("claiming initially should revert", async () => {
    const instance = await PoktWorkshop.deployed();

    await expectRevert(
      instance.claim(),
      "Currently there is nothing available to claim."
    );
  });
  it("nothing should exist for id=0", async () => {
    const instance = await PoktWorkshop.deployed();

    const id0Exists = await instance.exists(0);

    assert.isFalse(id0Exists, "It appears something does exist for id=0");
  });
  it("nothing should exist for id=1", async () => {
    const instance = await PoktWorkshop.deployed();

    const id1Exists = await instance.exists(1);

    assert.isFalse(id1Exists, "It appears something does exist for id=1");
  });
});

contract("PoktWorkshop access permissions", async (accounts) => {
  it("current workshop owner should be able to transfer to a new account", async () => {
    const currentOwner = accounts[0];
    const newOwner = accounts[1];
    const instance = await PoktWorkshop.deployed();

    await instance.transferWorkshop(newOwner);

    const newOwnerHasRole = await instance.hasRole(WORKSHOP_ROLE, newOwner);
    const oldOwnerHasRole = await instance.hasRole(WORKSHOP_ROLE, currentOwner);
    assert.isTrue(
      newOwnerHasRole,
      "The new owner does not have the Workshop role."
    );
    assert.isFalse(
      oldOwnerHasRole,
      "The old owner still has the Workshop role."
    );
  });
});

contract("PoktWorkshop item claiming", async (accounts) => {
  it("token should be claimable after one is made available", async () => {
    const instance = await PoktWorkshop.deployed();

    await instance.setNextItem(25);

    await instance.claim();

    const id1Balance = await instance.balanceOf(accounts[0], 1);

    assert.equal(
      id1Balance.valueOf(),
      1,
      "The account does not appear to have any balance of this token"
    );

    const id1Supply = await instance.totalSupply(1);

    assert.equal(
      id1Supply.valueOf(),
      1,
      "The total supply of item 1 appears incorrect after claim."
    );
  });
});

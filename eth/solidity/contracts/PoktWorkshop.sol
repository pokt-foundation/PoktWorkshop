// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/** @title Pokt Workshop
  * @author blockjoe
  * @notice An ERC-1155 that allows for developers participating in build workshops to claim a collection item by following along.
  * @dev At any given time, a single item of the collection has the ability to be claimed. Each address can only claim 1 item. While an item is claimable, it cannot be transfered.
  */
contract PoktWorkshop is ERC1155, ERC1155Supply, AccessControlEnumerable {
  bytes32 public constant WORKSHOP_ROLE = keccak256("WORKSHOP_ROLE");

  using Counters for Counters.Counter;
  Counters.Counter private _collectionIds;

  uint256 private _currentCollectionId = 0;
  uint256 private _claimableUntil = 0;

  /** @dev Initializes the URI and address that can authorize new workshop periods.
    * @param _uri The URI that corresponds to URI that resolves the metadata
    * @param workshop_owner The address that has the ability to authorize new workshop items
    */
  constructor(string memory _uri, address workshop_owner) ERC1155(_uri) {
    _setupRole(WORKSHOP_ROLE, workshop_owner);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControlEnumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /** @notice Transfer the contract of the workshop owner role to a new contract.
    * @dev Only can be called by the current workshop_owner.
    * @param new_owner The address of the new workshop owner.
    */
  function transferWorkshop(address new_owner) public onlyRole(WORKSHOP_ROLE) {
    _setupRole(WORKSHOP_ROLE, new_owner);
    renounceRole(WORKSHOP_ROLE, msg.sender);
  }

  /** @notice Update the URI for all items in the collection.
    * @dev Only can be called by the current workshop_owner.
    * @param _newuri The new metadata URI for all items in the collection.
    */
  function changeURI(string memory _newuri) public onlyRole(WORKSHOP_ROLE) {
    _setURI(_newuri);
  }

  /** @notice Set the next item available to be claimed for the specified number of blocks.
    * @dev Only can be called by the current workshop_owner.
    * @param validForNextBlocks The number of blocks that the next item can be claimed for.
    */
  function setNextItem(uint256 validForNextBlocks) public onlyRole(WORKSHOP_ROLE) {
    require(block.number > _claimableUntil, "Woah, looks like we've already promised something, gotta wait until that's done.");
    _collectionIds.increment();
    _currentCollectionId = _collectionIds.current();
    _claimableUntil = block.number + validForNextBlocks;
  }

  /** @notice Claim the next item if there is one available to claim. The item will be minted to the address of the caller.
    * @dev An address can only claim an item once, and items cannot be transfered while they have the ability to be claimed.
    * @return id The collection id of the claimed token.
    */
  function claim() public returns (uint256) {
    require(block.number <= _claimableUntil, "Currently there is nothing available to claim.");
    require(balanceOf(msg.sender, _currentCollectionId) == 0, "You can only claim one item from a collection.");

    _mint(msg.sender, _currentCollectionId, 1, "");
    return _currentCollectionId;
  }

  /** @notice Determine if there is an item that is currently claimable
    * @return True if there is a collection that's claimable.
    */
  function anythingClaimable() public view returns (bool) {
    return block.number < _claimableUntil;
  }

  function lastClaimableId() public view returns (uint256) {
    return _currentCollectionId;
  }

  /** @dev Override hook to make sure that if something is currently claimable, that the currently claimable item cannot be transfered.
    */
  function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal virtual override(ERC1155Supply, ERC1155) {
    if (block.number <= _claimableUntil) {
      if (from != address(0)) // not minting {
        for (uint256 i=0; i<ids.length; i++) {
          require(ids[i] != _currentCollectionId, "Items cannot be transfered while they are currently claimable.");
        }
      }
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
  }

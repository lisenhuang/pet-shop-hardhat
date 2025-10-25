// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Adoption {
    address[16] private adopters;

    function adopt(uint256 petId) external returns (uint256) {
        require(petId < adopters.length, "Invalid pet ID");
        require(adopters[petId] == address(0), "Pet already adopted");

        adopters[petId] = msg.sender;
        return petId;
    }

    function getAdopters() external view returns (address[16] memory) {
        return adopters;
    }

    function getAdopter(uint256 petId) external view returns (address) {
        require(petId < adopters.length, "Invalid pet ID");
        return adopters[petId];
    }
}

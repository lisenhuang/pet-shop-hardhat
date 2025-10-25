const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Adoption", function () {
  async function deployFixture() {
    const Adoption = await ethers.getContractFactory("Adoption");
    const adoption = await Adoption.deploy();
    await adoption.waitForDeployment();

    const [owner, adopterOne, adopterTwo] = await ethers.getSigners();
    return { adoption, owner, adopterOne, adopterTwo };
  }

  it("stores the adopter address after a successful adoption", async function () {
    const { adoption, adopterOne } = await deployFixture();
    await adoption.connect(adopterOne).adopt(8);

    const adopterAddress = await adoption.getAdopter(8);
    expect(adopterAddress).to.equal(adopterOne.address);
  });

  it("rejects adoptions for invalid pet ids", async function () {
    const { adoption } = await deployFixture();
    await expect(adoption.adopt(16)).to.be.revertedWith("Invalid pet ID");
  });

  it("prevents adopting the same pet twice", async function () {
    const { adoption, adopterOne, adopterTwo } = await deployFixture();
    await adoption.connect(adopterOne).adopt(0);

    await expect(adoption.connect(adopterTwo).adopt(0)).to.be.revertedWith(
      "Pet already adopted"
    );
  });

  it("returns the entire adopters array", async function () {
    const { adoption, adopterOne, adopterTwo } = await deployFixture();
    await adoption.connect(adopterOne).adopt(1);
    await adoption.connect(adopterTwo).adopt(2);

    const adopters = await adoption.getAdopters();
    expect(adopters[1]).to.equal(adopterOne.address);
    expect(adopters[2]).to.equal(adopterTwo.address);
  });
});

const { ethers, network } = require("hardhat");
const { mkdirSync, existsSync, writeFileSync } = require("fs");
const path = require("path");

async function main() {
  const Adoption = await ethers.getContractFactory("Adoption");
  const adoption = await Adoption.deploy();
  await adoption.waitForDeployment();

  const address = await adoption.getAddress();
  console.log(`Adoption deployed to ${address} on ${network.name}`);

  saveFrontendFiles(address);
}

function saveFrontendFiles(address) {
  const frontendDir = path.join(__dirname, "..", "frontend");

  if (!existsSync(frontendDir)) {
    mkdirSync(frontendDir);
  }

  const artifact = require("../artifacts/contracts/Adoption.sol/Adoption.json");
  writeFileSync(
    path.join(frontendDir, "Adoption.json"),
    JSON.stringify(artifact, null, 2)
  );

  writeFileSync(
    path.join(frontendDir, "contract-address.json"),
    JSON.stringify({ Adoption: address }, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

# Hardhat Pet Shop

Hardhat reimplementation of the classic [Truffle Pet Shop](https://archive.trufflesuite.com/guides/pet-shop/) tutorial. It ships with the same Solidity Adoption contract, a Hardhat toolbox workspace, automated tests, and a lightweight vanilla JavaScript front-end that talks to the deployed contract through `ethers.js`.

> All UI strings, comments, and documentation are written in English as requested.

## Requirements

- Node.js 18+ and npm
- MetaMask (or any browser wallet that injects `window.ethereum`)
- macOS/Linux/Windows shell with git

## Installation

```bash
git clone <repo-url>
cd pet-shop-hardhat
npm install
cp .env.example .env   # only needed if you plan to use Sepolia / Etherscan
```

## Contract Workflow

1. **Compile**
   ```bash
   npm run build
   ```
2. **Run the test suite**
   ```bash
   npm test
   ```
3. **Start a local blockchain**
   ```bash
   npm run node
   ```
   Leave this terminal open; it exposes `http://127.0.0.1:8545` with 20 funded accounts (the private keys are printed in the console).
4. **Deploy the Adoption contract to the local node**
   ```bash
   npm run deploy:localhost
   ```
   This script also exports `frontend/Adoption.json` (ABI) and `frontend/contract-address.json`, which the UI consumes.

## Front-end Workflow

1. (Ensure the local Hardhat node is still running and the contract has been deployed.)
2. In a new terminal:
   ```bash
   npm run dev:frontend
   ```
3. Navigate to `http://localhost:3000`.
4. Click **Connect Wallet**. MetaMask must point at **http://127.0.0.1:8545**, chain ID **1337**, currency symbol **ETH**. Import one of the private keys printed by `npm run node` to adopt a pet.

Whenever you redeploy the contract, refresh the browser so the UI picks up the new address/ABI.

## Deploying Elsewhere

Edit `.env` with `SEPOLIA_RPC_URL`, `PRIVATE_KEY`, and `ETHERSCAN_API_KEY`, then run:

```bash
npm run deploy:hardhat          # deploys to the in-process Hardhat network
hardhat run scripts/deploy.js --network sepolia
```

Remember to copy the generated `frontend/*.json` files if you plan to host the UI.

## Project Structure

```
contracts/Adoption.sol          # Solidity contract
scripts/deploy.js               # Deployment + frontend artifact export
test/Adoption.js                # Hardhat test suite
frontend/                       # Vanilla UI served by lite-server
```

## Available npm Scripts

| Script             | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `npm run build`    | Compile contracts                                      |
| `npm test`         | Run Hardhat tests                                      |
| `npm run node`     | Launch Hardhat Network at `127.0.0.1:8545`             |
| `npm run deploy:localhost` | Deploy to the local node and export frontend files |
| `npm run deploy:hardhat`   | Deploy to the built-in ephemeral Hardhat network   |
| `npm run dev:frontend`     | Serve the UI with `lite-server`                 |

## Troubleshooting

- **`contract-address.json` missing** – run `npm run build` then `npm run deploy:localhost` again.
- **MetaMask shows the wrong network** – open MetaMask → Networks → Add Network → `HTTP RPC URL: http://127.0.0.1:8545`, `Chain ID: 1337`, `Currency Symbol: ETH`.
- **Transactions fail instantly** – ensure the Hardhat node window is still running; restarting it resets the chain, so redeploy the contract afterward.

Enjoy adopting pets the Hardhat way!

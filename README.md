# Hardhat Pet Shop

> 🌟 Please hit **Star** if this repo helps you—thank you for the support!
>
> 🪄 Tip: Fork the project into your own GitHub account so you can customize the code freely and send pull requests back here when you add improvements.

Hardhat reimplementation of the classic [Truffle Pet Shop](https://archive.trufflesuite.com/guides/pet-shop/) tutorial. It ships with the same Solidity Adoption contract, a Hardhat toolbox workspace, automated tests, and a lightweight vanilla JavaScript front-end driven by `ethers.js`.

## ✅ Requirements

- Node.js 18+ and npm
- MetaMask (or any browser wallet that injects `window.ethereum`)
- macOS/Linux/Windows shell with git

## ⚙️ Installation

```bash
# Fork the repo, then clone your fork
git clone https://github.com/<your-username>/pet-shop-hardhat
cd pet-shop-hardhat
npm install
cp .env.example .env   # optional – needed only when deploying to Sepolia / verifying on Etherscan
```

## 🧱 Contract Workflow

1. **Compile**
   ```bash
   npm run build
   ```
2. **Run the tests**
   ```bash
   npm test
   ```
3. **Start a local blockchain**
   ```bash
   npm run node
   ```
   Leave this terminal open; it exposes `http://127.0.0.1:8545` with 20 funded accounts (private keys printed in the console).
4. **Deploy the Adoption contract to the local node**
   ```bash
   npm run deploy:localhost
   ```
   The script also exports `frontend/Adoption.json` (ABI) and `frontend/contract-address.json`, which the UI consumes.

## 🖥️ Front-end Workflow

1. Make sure the Hardhat node is still running and the contract is deployed.
2. In a new terminal:
   ```bash
   npm run dev:frontend
   ```
3. Open `http://localhost:3000`.
4. Click **Connect Wallet**. MetaMask must point at **http://127.0.0.1:8545**, chain ID **1337**, currency symbol **ETH**. Import one of the keys printed by `npm run node`, then adopt a pet.

Whenever you redeploy the contract, refresh the browser so the UI picks up the new address/ABI.

## 🚀 Deploying Elsewhere (optional)

Set `SEPOLIA_RPC_URL`, `PRIVATE_KEY`, and `ETHERSCAN_API_KEY` inside `.env`, then run:

```bash
npm run deploy:hardhat          # deploys to the in-process Hardhat network
npx hardhat run scripts/deploy.js --network sepolia
```

Copy the newly generated `frontend/*.json` files if you plan to host the UI.

## 🗂️ Project Structure

```text
pet-shop-hardhat
├── contracts
│   └── Adoption.sol
├── scripts
│   └── deploy.js
├── test
│   └── Adoption.js
├── frontend
│   ├── app.js
│   ├── index.html
│   ├── style.css
│   ├── pets.json
│   ├── Adoption.json
│   ├── contract-address.json
│   └── images
│       ├── boxer.jpeg
│       ├── french-bulldog.jpeg
│       ├── golden-retriever.jpeg
│       └── scottish-terrier.jpeg
└── hardhat.config.js
```

## 📜 Available npm Scripts

| Script                     | Description                                        |
| -------------------------- | -------------------------------------------------- |
| `npm run build`            | Compile contracts                                  |
| `npm test`                 | Run Hardhat tests                                  |
| `npm run node`             | Launch Hardhat Network at `127.0.0.1:8545`         |
| `npm run deploy:localhost` | Deploy to the local node and export frontend files |
| `npm run deploy:hardhat`   | Deploy to the built-in ephemeral Hardhat network   |
| `npm run dev:frontend`     | Serve the UI with `lite-server`                    |

## 🛠️ Troubleshooting

- **`contract-address.json` missing** – run `npm run build` then `npm run deploy:localhost` again.
- **MetaMask shows the wrong network** – open MetaMask → Networks → Add Network → `HTTP RPC URL: http://127.0.0.1:8545`, `Chain ID: 1337`, `Currency Symbol: ETH`.
- **Transactions fail instantly** – ensure the Hardhat node window is still running; restarting it resets the chain, so redeploy afterward.

Enjoy adopting pets the Hardhat way! 🐾

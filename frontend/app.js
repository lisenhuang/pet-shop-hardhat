const statusBanner = document.getElementById("status");
const petGrid = document.getElementById("petGrid");
const template = document.getElementById("pet-card-template");
const connectButton = document.getElementById("connectWallet");

const state = {
  pets: [],
  provider: null,
  signer: null,
  contract: null,
  contractAddress: null,
  contractAbi: null,
};

document.addEventListener("DOMContentLoaded", bootstrap);
connectButton.addEventListener("click", () => connectWallet());

async function bootstrap() {
  try {
    state.pets = await fetchJson("pets.json");
    renderPets(state.pets);
    updateStatus("Deploy the contract and connect your wallet to adopt a pet.");
  } catch (error) {
    updateStatus("Unable to load pets.json. Check that the file exists.");
    console.error(error);
  }

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", handleAccountChange);
    window.ethereum.on("chainChanged", () => window.location.reload());
  } else {
    updateStatus("MetaMask (or another injected wallet) is required to adopt.");
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    updateStatus("Install MetaMask to continue.");
    return;
  }

  try {
    connectButton.disabled = true;
    updateStatus("Requesting wallet access...");
    await window.ethereum.request({ method: "eth_requestAccounts" });

    state.provider = new ethers.BrowserProvider(window.ethereum);
    state.signer = await state.provider.getSigner();

    await loadContractMetadata();
    state.contract = new ethers.Contract(
      state.contractAddress,
      state.contractAbi,
      state.signer
    );

    updateStatus("Wallet connected. Pick a pet and submit the transaction in MetaMask.");
    enableAdoptButtons();
    await refreshAdoptions();
  } catch (error) {
    console.error(error);
    updateStatus(error.shortMessage || error.message || "Failed to connect wallet.");
  } finally {
    connectButton.disabled = false;
  }
}

async function handleAccountChange(accounts) {
  if (!accounts || accounts.length === 0) {
    updateStatus("No wallet connected. Click the Connect Wallet button.");
    disableAdoptButtons("Connect wallet to adopt");
    return;
  }

  if (!state.provider) {
    return;
  }

  state.signer = await state.provider.getSigner();
  if (state.contract) {
    state.contract = state.contract.connect(state.signer);
    await refreshAdoptions();
  }
}

async function loadContractMetadata() {
  if (state.contractAbi && state.contractAddress) {
    return;
  }

  try {
    const [addressJson, artifactJson] = await Promise.all([
      fetchJson("contract-address.json"),
      fetchJson("Adoption.json"),
    ]);

    if (!addressJson?.Adoption) {
      throw new Error("Contract address missing. Deploy the contract again.");
    }

    state.contractAddress = addressJson.Adoption;
    state.contractAbi = artifactJson.abi;
  } catch (error) {
    throw new Error(
      "Contract artifacts not found. Run the Hardhat deploy script before loading the dapp."
    );
  }
}

function renderPets(pets) {
  if (!template) {
    petGrid.textContent = "Template missing.";
    return;
  }

  petGrid.innerHTML = "";
  const fragment = document.createDocumentFragment();

  pets.forEach((pet) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".pet-card");
    const img = node.querySelector(".pet-photo");
    const name = node.querySelector(".pet-name");
    const meta = node.querySelector(".pet-meta");
    const location = node.querySelector(".pet-location");
    const button = node.querySelector(".adopt-button");

    img.src = pet.picture;
    img.alt = `${pet.name} the ${pet.breed}`;
    name.textContent = pet.name;
    meta.textContent = `${pet.breed} · ${pet.age} years old`;
    location.textContent = pet.location;

    button.dataset.petId = pet.id;
    button.addEventListener("click", handleAdopt);

    fragment.appendChild(node);
  });

  petGrid.appendChild(fragment);
}

async function handleAdopt(event) {
  const button = event.currentTarget;
  const petId = Number(button.dataset.petId);

  if (!state.contract) {
    updateStatus("Connect your wallet and deploy the contract first.");
    return;
  }

  let originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = "Waiting for tx...";

  try {
    const tx = await state.contract.adopt(petId);
    updateStatus(`Transaction sent: ${tx.hash}`);
    await tx.wait();
    updateStatus(`Pet #${petId} adopted successfully!`);
    await refreshAdoptions();
  } catch (error) {
    console.error(error);
    updateStatus(error.shortMessage || error.message || "Transaction failed.");
    button.disabled = false;
    button.textContent = originalLabel;
  }
}

async function refreshAdoptions() {
  if (!state.contract) {
    return;
  }

  try {
    const adopters = await state.contract.getAdopters();
    adopters.forEach((adopter, index) => {
      const button = document.querySelector(`.adopt-button[data-pet-id="${index}"]`);
      const card = button?.closest(".pet-card");

      if (!button || !card) {
        return;
      }

      if (adopter && adopter !== ethers.ZeroAddress) {
        card.classList.add("adopted");
        button.disabled = true;
        button.textContent = "Adopted";
      } else {
        if (!state.signer) {
          button.disabled = true;
          button.textContent = "Connect wallet to adopt";
        } else {
          card.classList.remove("adopted");
          button.disabled = false;
          button.textContent = "Adopt";
        }
      }
    });
  } catch (error) {
    console.error(error);
    updateStatus("Unable to read adoption data. Is the Hardhat node still running?");
  }
}

function enableAdoptButtons() {
  document.querySelectorAll(".adopt-button").forEach((button) => {
    if (!button.closest(".pet-card")?.classList.contains("adopted")) {
      button.disabled = false;
      button.textContent = "Adopt";
    }
  });
}

function disableAdoptButtons(label) {
  document.querySelectorAll(".adopt-button").forEach((button) => {
    button.disabled = true;
    button.textContent = label;
  });
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return response.json();
}

function updateStatus(message) {
  if (statusBanner) {
    statusBanner.textContent = message;
  }
}

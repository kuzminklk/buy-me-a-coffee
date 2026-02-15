

import { createWalletClient, createPublicClient, parseEther, formatEther, custom } from "https://esm.sh/viem"
import { sepolia } from "https://esm.sh/viem/chains"
import { contractAddress, abi } from "./constants.js"


const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const getBalanceButton = document.getElementById("getBalanceButton")
const withdrawButton = document.getElementById("withdrawButton")
const balanceSpan = document.getElementById("balance")
const etherAmountInput = document.getElementById("etherAmount")

connectButton.addEventListener("click", connectWallet)
fundButton.addEventListener("click", fund)
getBalanceButton.addEventListener("click", getBalance)
withdrawButton.addEventListener("click", withdraw)

let walletClient
let publicClient
let connectedAccount

const clientConfig = {
	transport: custom(window.ethereum),
	chain: sepolia
}


async function connectWallet() {
	if (typeof window.ethereum === "undefined") {
		connectButton.innerText = "Install MetaMask"
		return
	}

	walletClient = await createWalletClient(clientConfig);
	publicClient = await createPublicClient(clientConfig);

	[connectedAccount] = await walletClient.requestAddresses()
	connectButton.innerText = "Connected"
}


async function fund() {
	if (typeof walletClient === "undefined") {
		await connectWallet()
	}

	const etherAmount = etherAmountInput.value

	const { request } = await publicClient.simulateContract({
		address: contractAddress,
		abi: abi,
		functionName: "fund",
		account: connectedAccount,
		chain: sepolia,
		value: parseEther(etherAmount)
	})

	await walletClient.writeContract(request)
}


async function getBalance() {
	if (typeof walletClient === "undefined") {
		await connectWallet()
	}

	const balance = await publicClient.getBalance({
		address: contractAddress
	})

	balanceSpan.innerText = formatEther(balance)
}


async function withdraw() {
	if (typeof walletClient === "undefined") {
		await connectWallet()
	}

	const { request } = await publicClient.simulateContract({
		address: contractAddress,
		abi: abi,
		functionName: "withdraw",
		account: connectedAccount,
		chain: sepolia
	})

	await walletClient.writeContract(request)
}
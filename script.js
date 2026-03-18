

/* 
	Structure

		DOM Elements
		Configuration
		State
	Theme Toggle
	Contract Interactions
		Event Listeners
	Initialization

*/


import { createWalletClient, createPublicClient, parseEther, formatEther, custom } from "https://esm.sh/viem"
import { sepolia } from "https://esm.sh/viem/chains"
import { contractAddress, abi } from "./constants.js"



// DOM Elements
const themeToggle = document.getElementById("theme-toggle")
const connectButton = document.getElementById("connect-button")
const fundButton = document.getElementById("fund-button")
const withdrawButton = document.getElementById("withdraw-button")
const balanceDisplay = document.getElementById("balance")
const etherAmountInput = document.getElementById("ether-amount")
const htmlElement = document.documentElement


// Configuration
const clientConfig = {
	transport: custom(window.ethereum),
	chain: sepolia
}

const BALANCE_UPDATE_INTERVAL = 5000 // 5 seconds


// State
let walletClient = null
let publicClient = null
let connectedAccount = null


// ——— Theme Toggle ———

/**
 * Initialize theme from localStorage or system preference
 */
const initializeTheme = () => {
	const savedTheme = localStorage.getItem("theme")
	const systemDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
	const initialTheme = savedTheme || (systemDarkMode ? "dark" : "light")
	
	htmlElement.setAttribute("data-theme", initialTheme)
	updateThemeToggleButton(initialTheme)
}

/**
 * Update theme toggle button text based on current theme
 */
const updateThemeToggleButton = (theme) => {
	themeToggle.innerText = theme === "dark" ? "☀️ Light" : "🌙 Dark"
}

/**
 * Toggle between light and dark theme
 */
const toggleTheme = () => {
	const currentTheme = htmlElement.getAttribute("data-theme") || "light"
	const newTheme = currentTheme === "light" ? "dark" : "light"
	
	htmlElement.setAttribute("data-theme", newTheme)
	localStorage.setItem("theme", newTheme)
	updateThemeToggleButton(newTheme)
}


// ——— Contract Interactions ———

/**
 * Initialize wallet client
 */
const setupWalletClient = async () => {
	if (typeof window.ethereum === "undefined") {
		connectButton.innerText = "Install MetaMask"
		return false
	}

	walletClient = await createWalletClient(clientConfig)
	publicClient = await createPublicClient(clientConfig)
	return true
}

/**
 * Connect user's wallet and update button state
 */
const connectWallet = async () => {
	const isReady = await setupWalletClient()
	if (!isReady) return

	try {
		[connectedAccount] = await walletClient.requestAddresses()
		connectButton.innerText = "Connected"
	} catch (error) {
		console.error("Failed to connect wallet:", error)
		connectButton.innerText = "Connect Wallet"
	}
}

/**
 * Fetch contract balance and update display
 */
const updateBalance = async () => {
	try {
		if (!publicClient) {
			await setupWalletClient()
		}

		const balance = await publicClient.getBalance({
			address: contractAddress
		})

		const formattedBalance = formatEther(balance)
		balanceDisplay.innerText = `💰 ${formattedBalance} ETH`
	} catch (error) {
		console.error("Failed to fetch balance:", error)
		balanceDisplay.innerText = "Error loading balance"
	}
}

/**
 * Send ETH to the contract
 */
const fund = async () => {
	if (!walletClient) {
		await connectWallet()
		if (!walletClient) return
	}

	try {
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
		
		// Update balance after successful transaction
		setTimeout(updateBalance, 2000)
	} catch (error) {
		console.error("Failed to fund:", error)
	}
}

/**
 * Withdraw accumulated funds from contract
 */
const withdraw = async () => {
	if (!walletClient) {
		await connectWallet()
		if (!walletClient) return
	}

	try {
		const { request } = await publicClient.simulateContract({
			address: contractAddress,
			abi: abi,
			functionName: "withdraw",
			account: connectedAccount,
			chain: sepolia
		})

		await walletClient.writeContract(request)
		
		// Update balance after successful transaction
		setTimeout(updateBalance, 2000)
	} catch (error) {
		console.error("Failed to withdraw:", error)
	}
}


// Event Listeners
themeToggle.addEventListener("click", toggleTheme)
connectButton.addEventListener("click", connectWallet)
fundButton.addEventListener("click", fund)
withdrawButton.addEventListener("click", withdraw)


// ——— Initialization ———

/**
 * Initialize the application on page load
 */
const init = async () => {
	// Set up theme
	initializeTheme()

	// Set up public client and load initial balance
	await setupWalletClient()
	await updateBalance()

	// Auto-update balance periodically
	setInterval(updateBalance, BALANCE_UPDATE_INTERVAL)
}

// Run initialization
init()
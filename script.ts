import { 
  createWalletClient, 
  createPublicClient, 
  parseEther, 
  formatEther, 
  custom,
  WalletClient,
  PublicClient,
  Chain,
  Address,
  CustomTransport
} from "viem"
import "viem/window"
import { sepolia } from "viem/chains"
import { contractAddress, abi } from "./constants.ts"


const connectButton = document.getElementById("connectButton") as HTMLButtonElement
const fundButton = document.getElementById("fundButton") as HTMLButtonElement
const getBalanceButton = document.getElementById("getBalanceButton") as HTMLButtonElement
const withdrawButton = document.getElementById("withdrawButton") as HTMLButtonElement
const balanceSpan = document.getElementById("balance") as HTMLSpanElement
const etherAmountInput = document.getElementById("etherAmount") as HTMLInputElement

connectButton.addEventListener("click", connectWallet)
fundButton.addEventListener("click", fund)
getBalanceButton.addEventListener("click", getBalance)
withdrawButton.addEventListener("click", withdraw)

let walletClient: WalletClient<CustomTransport, Chain> | undefined
let publicClient: PublicClient<CustomTransport, Chain> | undefined
let connectedAccount: Address | undefined

interface EthereumProvider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>
}

const clientConfig = {
	transport: custom(window.ethereum as unknown as EthereumProvider),
	chain: sepolia
}


async function connectWallet(): Promise<void> {
	if (typeof window.ethereum === "undefined") {
		connectButton.innerText = "Install MetaMask"
		return
	}

	walletClient = await createWalletClient(clientConfig)
	publicClient = await createPublicClient(clientConfig)

	const accounts = await walletClient.requestAddresses()
	connectedAccount = accounts[0]
	connectButton.innerText = "Connected"
}


async function fund(): Promise<void> {
	if (typeof walletClient === "undefined") {
		await connectWallet()
	}

	const etherAmount = etherAmountInput.value

	const { request } = await publicClient!.simulateContract({
		address: contractAddress,
		abi: abi,
		functionName: "fund",
		account: connectedAccount!,
		chain: sepolia,
		value: parseEther(etherAmount)
	})

	await walletClient!.writeContract(request)
}


async function getBalance(): Promise<void> {
	if (typeof walletClient === "undefined") {
		await connectWallet()
	}

	const balance = await publicClient!.getBalance({
		address: contractAddress
	})

	balanceSpan.innerText = formatEther(balance)
}


async function withdraw(): Promise<void> {
	if (typeof walletClient === "undefined") {
		await connectWallet()
	}

	const { request } = await publicClient!.simulateContract({
		address: contractAddress,
		abi: abi,
		functionName: "withdraw",
		account: connectedAccount!,
		chain: sepolia
	})

	await walletClient!.writeContract(request)
}

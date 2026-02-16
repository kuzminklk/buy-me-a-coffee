import { Address, Abi } from "viem"

export const contractAddress: Address = "0x40687a9931f17c89d245dFB4a0A287F7745c0eE2"

export const abi: Abi = [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "priceFeedAddress",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    { "type": "fallback", "stateMutability": "payable" },
    { "type": "receive", "stateMutability": "payable" },
    {
      "type": "function",
      "name": "MINIMUM_USD",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "OWNER",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "PRICE_FEED_ADDRESS",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "fund",
      "inputs": [],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "sAddressToAmountFunded",
      "inputs": [
        { "name": "funder", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "amountFunded", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "sFunders",
      "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "withdraw",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    { "type": "error", "name": "FundMe__CallFailed", "inputs": [] },
    { "type": "error", "name": "FundMe__NotOwner", "inputs": [] },
    { "type": "error", "name": "FundMe__PriceStale", "inputs": [] }
  ]

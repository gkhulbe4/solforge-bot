# 🤖 Solana Telegram Wallet Bot

A **Telegram bot** that allows users to **create and manage Solana wallets** securely right inside chat. From wallet generation to transferring SOL — all done with end-to-end encryption and a clean UX.

![Solana](https://img.shields.io/badge/Solana-Blockchain-purple?style=for-the-badge)
![Telegram](https://img.shields.io/badge/Telegram-Bot-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-In%20Progress-yellow?style=for-the-badge)

---

## ✨ Features

- 🔐 **Wallet Creation**  
  Instantly create a Solana wallet via Telegram commands.

- 🛡️ **AES Encryption for Private Keys**  
  Private keys are never stored in plain text. Each key is encrypted using:

  - A randomly generated **IV**
  - A user-specific **authTag**
  - AES-256-GCM encryption

- 💸 **Transfer SOL**  
  Transfer SOL to any address right from chat.

- 💾 **MongoDB Storage**  
  User info, encrypted private keys, IVs, and metadata are stored securely.

- 📄 **Transaction Signatures**  
  Each transfer confirms with a transaction signature link.

---

## 🔧 Still in Progress

I'm actively working on:

- 💱 **Token Trading (SPL Swap)**
- 🪙 **Custom Token Transactions**
- 🖼️ **NFT Interactions**
- ⚙️ **Advanced Wallet Analytics**

---

## 🛠 Tech Stack

| Tech           | Purpose                       |
| -------------- | ----------------------------- |
| Node.js        | Server-side runtime           |
| Telegraf.js    | Telegram bot framework        |
| Solana Web3.js | Solana blockchain interaction |
| Mongoose       | MongoDB schema & interaction  |
| Node Crypto    | Key encryption with AES-GCM   |

---

## 📁 Project Structure

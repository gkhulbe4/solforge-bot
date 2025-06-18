# 🤖 SolForge (TGbot)

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

## 🛠 Tech Stack

| Tech           | Purpose                       |
| -------------- | ----------------------------- |
| Node.js        | Server-side runtime           |
| Telegraf.js    | Telegram bot framework        |
| Solana Web3.js | Solana blockchain interaction |
| Mongoose       | MongoDB schema & interaction  |
| Node Crypto    | Key encryption with AES-GCM   |

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/gkhulbe4/solforge-bot
cd solforge-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Create a `.env` file in the root:

```env
BOT_TOKEN=your_bot_token
MONGO_URI=your_mongo_connection_string
ENCRYPTION_SECRET_KEY=your_aes_secret_key_32_chars

```

### 4. Start Development Server

```bash
npm run dev
```

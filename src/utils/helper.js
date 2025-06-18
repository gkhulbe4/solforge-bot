import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import crypto from "crypto";
import "dotenv/config";
import { connection } from "../blockchain/solana.js";

const algorithm = "aes-256-cbc";
const secretKey = Buffer.from(process.env.ENCRYPTION_SECRET_KEY, "hex");

export async function encrypt(text) {
  // console.log(secretKey);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
  };
}

export async function decrypt(encryptedData, iv) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export async function prepareTransaction(
  senderPublicKey,
  senderEncryptedPrivateKey,
  senderIv,
  recipientPublicKey,
  amount
) {
  try {
    const senderPrivateKey = await decrypt(senderEncryptedPrivateKey, senderIv);
    const secretKey = Uint8Array.from(Buffer.from(senderPrivateKey, "hex"));
    const senderKeypair = Keypair.fromSecretKey(secretKey);
    // console.log(senderPrivateKey);

    const ix = SystemProgram.transfer({
      fromPubkey: new PublicKey(senderPublicKey),
      toPubkey: new PublicKey(recipientPublicKey),
      lamports: amount,
    });

    const tx = new Transaction().add(ix);
    const { blockhash } = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = new PublicKey(senderPublicKey);

    tx.sign(senderKeypair);

    const signature = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction(signature, "confirmed");
    return signature;
  } catch (error) {
    console.log(error);
  }
}

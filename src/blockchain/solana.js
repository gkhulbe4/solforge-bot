import { Keypair, Connection, clusterApiUrl } from "@solana/web3.js";
import "dotenv/config";
import { encrypt } from "../utils/helper.js";
import Users from "../models/user.js";

const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_SECRET_KEY;
const RPC_URL = clusterApiUrl("devnet");
export const connection = new Connection(RPC_URL);

export async function createWallet(id, firstName, isBot, username) {
  const userExits = await Users.findOne({ tgId: id });
  if (userExits) return userExits.publicKey;

  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const privateKey = Buffer.from(keypair.secretKey).toString("hex");

  const { encryptedData, iv } = await encrypt(privateKey);

  const newUser = await Users.create({
    tgId: id,
    isBot: isBot,
    publicKey: publicKey,
    encryptedPrivateKey: encryptedData,
    iv: iv,
    firstName: firstName,
    username: username,
  });
  // console.log(newUser);
  return publicKey;
}

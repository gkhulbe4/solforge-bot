import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { connection, createWallet } from "../blockchain/solana.js";
import Users from "../models/user.js";
import { prepareTransaction } from "../utils/helper.js";

export default function setupCommands(bot) {
  bot.start(async (ctx) => {
    const { id, first_name, is_bot, username } = ctx.update.message.from;
    try {
      const publicKey = await createWallet(id, first_name, is_bot, username);
      const walletBalance = await connection.getBalance(
        new PublicKey(publicKey)
      );

      ctx.reply(
        `👋 Welcome ${first_name} to SolForge!\n\n` +
          `💰 You currently have ${
            walletBalance / LAMPORTS_PER_SOL || "0"
          } Dev SOL in your wallet.\n\n` +
          (!walletBalance
            ? `➡️ To start trading, please deposit SOL to your SolForgeBot wallet address:\n${publicKey}\n\n`
            : "") +
          `🚀 /airdrop — Request free Dev SOL`
      );
    } catch (error) {
      console.log(error);
      ctx.reply("Facing difficulties. Please try again heheheh.");
    }
  });

  bot.command("airdrop", async (ctx) => {
    const { id } = ctx.update.message.from;
    try {
      const user = await Users.findOne({ tgId: id });
      const walletAddress = user.publicKey;
      const airdropAmount = 3 * LAMPORTS_PER_SOL;
      const sig = await connection.requestAirdrop(
        new PublicKey(walletAddress),
        airdropAmount
      );
      // await connection.confirmTransaction(sig, "confirmed");

      ctx.reply(
        `✨ Airdrop of ${
          airdropAmount / LAMPORTS_PER_SOL
        } Dev SOL sent to your wallet!\n\n`
      );
      // ctx.reply(
      //   `Tx Complete: https://explorer.solana.com/tx/${sig}?cluster=devnet`
      // );
    } catch (error) {
      console.log(error);
      ctx.reply(
        "⚠️ You've either reached your airdrop limit today or the airdrop faucet has run dry.\n\nYou can manually request free Dev SOL from the official Solana Faucet.",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚰 Open Solana Faucet",
                  web_app: { url: "https://faucet.solana.com/" },
                },
              ],
            ],
          },
        }
      );
    }
  });

  bot.command("balance", async (ctx) => {
    const { id } = ctx.update.message.from;
    try {
      const user = await Users.findOne({ tgId: id });
      const walletAddress = user.publicKey;
      const walletBalance = await connection.getBalance(
        new PublicKey(walletAddress)
      );
      ctx.reply(
        `💰 Current Balance: ${walletBalance / LAMPORTS_PER_SOL} Dev SOL`
      );
    } catch (error) {
      console.log(error);
      ctx.reply("Facing difficulties. Please try again.");
    }
  });

  bot.command("wallet", async (ctx) => {
    const { id } = ctx.update.message.from;
    try {
      const user = await Users.findOne({ tgId: id });
      const walletAddress = user.publicKey;
      ctx.reply(`📬 Wallet Address: ${walletAddress}`);
    } catch (error) {
      console.log(error);
      ctx.reply("Facing difficulties. Please try again.");
    }
  });

  bot.command("send", async (ctx) => {
    ctx.session = {};
    await ctx.reply("Choose how much SOL you want to send:", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "💯 100%", callback_data: "send_100" },
            { text: "🔗 50%", callback_data: "send_50" },
            { text: "✏️ Custom", callback_data: "send_custom" },
          ],
        ],
      },
    });
  });

  bot.action(/send_(\w+)/, async (ctx) => {
    await ctx.answerCbQuery();
    const choice = ctx.match[1];
    ctx.session.percentage = choice;
    // console.log(choice);

    if (choice === "custom") {
      ctx.reply("Enter the amount of SOL you want to send:");
      ctx.session.step = "awaiting_custom_amount";
    } else {
      ctx.reply("Please enter the wallet address to send SOL to:");
      ctx.session.step = "awaiting_address";
    }
  });

  bot.on("text", async (ctx) => {
    const step = ctx.session.step;

    if (step === "awaiting_custom_amount") {
      const amount = parseFloat(ctx.message.text);
      if (isNaN(amount) || amount <= 0) {
        return ctx.reply("❌ Please enter a valid number greater than 0.");
      }
      ctx.session.customAmount = amount * LAMPORTS_PER_SOL;
      ctx.session.step = "awaiting_address";
      return ctx.reply("Now enter the wallet address to send SOL to:");
    }

    if (step === "awaiting_address") {
      const recipientAddress = ctx.message.text;
      let validAddress = true;
      try {
        new PublicKey(recipientAddress);
      } catch (error) {
        validAddress = false;
      }

      if (!validAddress) {
        return ctx.reply(
          "❌ Invalid wallet address. Please enter a valid Solana address."
        );
      }

      const percentage = ctx.session.percentage;
      const customAmount = ctx.session.customAmount;

      const user = await Users.findOne({ tgId: ctx.update.message.from.id });
      const walletAddress = user.publicKey;
      const userBalance = await connection.getBalance(
        new PublicKey(walletAddress)
      );

      let amountToSend;
      if (percentage === "100") {
        amountToSend = userBalance;
      } else if (percentage === "50") {
        amountToSend = userBalance / 2;
      } else if (percentage === "custom") {
        amountToSend = customAmount;
      }
      // console.log(amountToSend);

      if (amountToSend > userBalance) {
        return ctx.reply(
          "❌ You don't have enough balance to send that amount."
        );
      }

      ctx.reply(`✅ Preparing to send ${amountToSend / LAMPORTS_PER_SOL} SOL`);

      try {
        const signature = await prepareTransaction(
          user.publicKey,
          user.encryptedPrivateKey,
          user.iv,
          recipientAddress,
          amountToSend
        );

        ctx.reply(
          `✅ Successfully sent ${
            amountToSend / LAMPORTS_PER_SOL
          } SOL to ${recipientAddress}\n` +
            `📝 You can see you transaction here: https://explorer.solana.com/tx/${signature}?cluster=devnet`
        );
      } catch (error) {
        console.log(error);
        ctx.reply("Facing difficulties. Please try again.");
      }
      ctx.session = {};
    }
  });
}

import "dotenv/config";
import connectDB from "./config/db.js";
import bot from "./bot/index.js";

await connectDB();
bot.launch();
console.log("🤖 Bot is live...");

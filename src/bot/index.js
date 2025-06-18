import { Telegraf, session } from "telegraf";
import setupCommands from "./commands.js";

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

setupCommands(bot);

export default bot;

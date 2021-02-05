const chalk = require("chalk");
const moment = require("moment-timezone")
const fs = require("fs")

module.exports = async (client) => {
    console.log(chalk.blue(`[CLIENT EVENT | READY] ${chalk.green(moment(client.readyAt).tz('Asia/Tokyo').format('YYYY年MM月DD日 h:mm:ss A'))}`));
    require("../loaders/loadCommands")(client);
    const ADMIN_GUILD = await client.guilds.cache.get(client.guildId)
};
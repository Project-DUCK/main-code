const chalk = require("chalk");

module.exports = async (client) => {
    console.log(chalk.blue(`[CLIENT EVENT | READY] ${chalk.green(new Date(Date.now()+ ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000)))}`));
    require("../loaders/loadCommands")(client);
    const ADMIN_GUILD = await client.guilds.cache.get(client.guildId)
};
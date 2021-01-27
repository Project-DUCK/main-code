const chalk = require("chalk");

module.exports = async (guild) => {
    console.log(chalk.blue(`[CLIENT EVENT | GUILDCREATE] ${chalk.green("GUILD:"+guild.name+"("+guild.id+")")}`));
};
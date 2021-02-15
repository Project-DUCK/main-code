const chalk = require("chalk");

module.exports = async (guild) => {
    console.log(chalk.blue(`[CLIENT EVENT | GUILDCREATE] ${chalk.green("GUILD:"+guild.name+"("+guild.id+")")}`));
    const ref = client.db.ref(`prefix_${guild.id}`);
    ref.update({
      prefix:process.env.BOT_PREFIX
    })
};
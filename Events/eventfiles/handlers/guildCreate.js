const chalk = require("chalk");
const xpSetting = require('./../../../Models/xpSetting');

module.exports = async (guild) => {
    console.log(chalk.blue(`[CLIENT EVENT | GUILDCREATE] ${chalk.green("GUILD:"+guild.name+"("+guild.id+")")}`));
    const ref = client.db.ref(`prefix_${guild.id}`);
    ref.update({
      prefix:process.env.BOT_PREFIX
    })
    let IsNewGuild = await xpSetting.findOne({
      guildId:guild.id
    })
    if(!IsNewGuild){
      let NewSetting = new xpSetting({
        guildId: guild.id,
        isOn:false,
      })
     await NewSetting.save();
    }
}
const { MessageEmbed } = require('discord.js');
const xpSetting = require('./../Models/xpSetting');
const guildMember = require('./../Models/guildMember');

module.exports = {
	name: 'exp',
	aliases: [],
	disabled: false,
	description: 'このサーバーのxp設定を行います',
	example: '[on|off]',
	userPerms: ['ADMINISTRATOR'],
	details:
		'xpシステムを使用するかを設定します。\nオン:\`{{p}}exp on\`\nオフ:\`{{p}}exp off\`',
	cooldown: 10,
	ownerOnly: false,

	async execute(message, args, client) {
	  const GUILD = message.guild;
	  let isOn;
	  var THIS_GUILD_SETTING = await xpSetting.findOne({
	    guildId: GUILD.id,
	  })
	  if(!THIS_GUILD_SETTING){
	    THIS_GUILD_SETTING = new xpSetting({
	      guildId: GUILD.id,
	      isOn:false
	    })
	  await THIS_GUILD_SETTING.save();
	  }else{
	    isOn = THIS_GUILD_SETTING.isOn;
	  }
	  if(args[0].toLowerCase() === 'on'){
	    if(THIS_GUILD_SETTING.isOn == true){
	      return message.channel.send("既にオンになっています。")
	    }else{
	    THIS_GUILD_SETTING.isOn = true;
	    await THIS_GUILD_SETTING.save();
	    message.channel.send("xpをオンに設定しました。")
	    }
	    
	  }else if(args[0].toLowerCase() === 'off'){
	    if(THIS_GUILD_SETTING.isOn == false){
	      return message.channel.send("既にオフになっています。")
	    }
	    THIS_GUILD_SETTING.isOn = false;
	    await THIS_GUILD_SETTING.save();
	    message.channel.send("xpをオフに設定しました。")
	  }else{
	    return message.reply(("引数が間違っています\n\`{{p}}help expで確認できます\`").replace('{{p}}',message.guild.prefix))
	  }
	  
	  
	}
};

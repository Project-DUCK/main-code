const { MessageEmbed } = require('discord.js');
const xpSetting = require('./../Models/xpSetting');
const guildMember = require('./../Models/guildMember');

module.exports = {
	name: 'show-xp',
	aliases: ['rank','xp','level','sx'],
	disabled: false,
	description: 'xp,levelを表示します。',
	example: '[@member]',
	userPerms: [],
	details:'',
	cooldown: 10,
	ownerOnly: false,

	async execute(message, args, client) {
	  const GUILD = message.guild;
    let MEMBER;
    if(!args[0]){
      MEMBER = GUILD.members.cache.get(message.author.id);
    }else {
        MEMBER = GUILD.members.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''))
    }
    if(MEMBER === undefined){
        return message.reply("メンバーを取得できませんでした")
    }
    let GuildModel = await xpSetting.findOne({
      guildId:GUILD.id
    })
    if(GuildModel.isOn === false){
      return message.channel.send("このサーバーのxp機能はオフになっています");
    }
    var Member_Model = await guildMember.findOne({
      guildId: GUILD.id,
      memberId: MEMBER.id
    })
    let lv = Member_Model.level;
    let xp_embed = new MessageEmbed()
    .setTitle(MEMBER.user.tag+"のxp")
    .setAuthor(MEMBER.user.tag,MEMBER.user.displayAvatarURL({dynamic:true}))
    .addField("xp",Member_Model.xp,true)
    .addField("level",Member_Model.level,true)
    .addField("次のレベルまで",lv*lv*lv+5 - Member_Model.xp,true)
    .setTimestamp()

    message.channel.send(xp_embed);

	}
};

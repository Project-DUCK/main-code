const { MessageEmbed } = require("discord.js");
const { inspect } = require("util");
const moment = require("moment");
require("moment-timezone")
const FILTERLEVELS = {
  DISABLED: 'オフ',
  MEMBERS_WITHOUT_ROLES: 'ロールなしのみ',
  ALL_MEMBERS: '全員'
};
const VERIFICATIONLEVELS = {
  NONE: 'なし',
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  VERY_HIGH: '最高'
};


module.exports = {
    name: "serverinfo",
    aliases: ["si"],
    disabled: false,
    description: `サーバーの情報を表示します。`,
    example: ``,
    details: `サーバーの情報を表示します。オプションはありません`,
    userPerms: [],
    cooldown: 10,
    ownerOnly: false,
    
    async execute(message,args,client){
      const GUILD = message.guild;
      if(GUILD.members.cache.has(GUILD.ownerID)) await GUILD.members.fetch(GUILD.ownerID)
      let guild_embed = new MessageEmbed()
      .setColor(GUILD.owner.displayHexColor)
      .setTitle(`${GUILD.name}の情報`)
      .setThumbnail(GUILD.iconURL({format:'jpg'}))
      .addField('サーバー名',GUILD.name,true)
      .addField('サーバーID',GUILD.id,true)
      .addField('サーバー作成日時',moment(GUILD.createdAt).tz("Asia/Tokyo").format('MM/DD/YYYY h:mm A'),true)
      .addField('オーナー',`${GUILD.owner.user.tag}(${GUILD.ownerID})`,true)
      .addField('ブースト数',GUILD.premiumSubscriptionCount || 0 ,true)
      .addField('サーバーレベル',GUILD.premiumTire ? `レベル${GUILD.premiumTire}` : 'レベル0',true)
      .addField('国',GUILD.region.toUpperCase(),true)
      .addField('メッセージフィルター',FILTERLEVELS[GUILD.explicitContentFilter],true)
      .addField('認証レベル',VERIFICATIONLEVELS[GUILD.verificationLevel],true)
      .addField('総メンバー数',GUILD.memberCount,true)
      .addField('bot数',GUILD.members.cache.filter(m => m.user.bot === true).size,true)
      .addField('メンバー数',GUILD.members.cache.filter(m => m.user.bot !== true).size,true)
      .addField('ロール数',GUILD.roles.cache.size,true)
      .addField('チャンネル数',GUILD.channels.cache.filter(c => c.type !== 'category').size, true)
      message.channel.send(guild_embed)
    }
}
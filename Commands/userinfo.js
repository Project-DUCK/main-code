const { MessageEmbed } = require("discord.js");
const { inspect } = require("util");
const moment = require("moment");
require("moment-timezone");
const Util = require('./../Util/util')

module.exports = {
    name: "userinfo",
    aliases: ["ui"],
    disabled: false,
    description: `指定したユーザーの情報を検索します。`,
    example: `[<@member>]`,
    details: `コマンドの後に半角スペースを開けて\nユーザーのIDかユーザーをメンションしてください\n(IDを使うことでこのサーバーに居ないユーザーも取得できます)\n例: \`d>userinfo 1234546789101\` \`d>userinfo @member\``,
    userPerms: [],
    cooldown: 10,
    ownerOnly: false,
    
    async execute(message,args,client){
        const USER_ID = args[0].replace("<@!", "").replace("<@", "").replace(">", "");
 
        let USER = await client.users.fetch(USER_ID)
        if(!USER){
          const ADMIN_GUILD = await client.guilds.cache.get(client.guildId)
          ADMIN_GUILD.members.ban(USER_ID).then(u => USER = u).catch(e=>{})
          await ADMIN_GUILD.members.unban(USER_ID)
        }
        let user_embed = new MessageEmbed()
            .setTitle(USER.name + "の情報")
            .setThumbnail(USER.displayAvatarURL({ format: "jpg" }))
            .addField("ユーザー名", USER.tag, true)
            .addField("ユーザーID", USER.id, true)
            .addField("bot", USER.bot ? "bot" : "ユーザー", true)
            .addField("アカウント作成日時", moment(USER.createdAt).tz("Asia/Tokyo").format("YYYY/MM/DD h:mm A"), true)
            
            const MEMBER = await message.guild.members.cache.get(USER_ID)
            const DEFAULTROLE = await message.guild.roles.cache.get(message.guild.id)
            const ROLES = await MEMBER.roles.cache.filter(r => r.id !== DEFAULTROLE.id).sort((a,b)=> b.position - a.position).map(r=>r.id)
            if(MEMBER){
            user_embed.addField("サーバー入室日時",moment(MEMBER.joinedAt).tz("Asia/Tokyo").format("YYYY/MM/DD h:mm A"),true)
            .addField("最上位ロール",MEMBER.roles.highest.id === defaultRole.id ? 'なし' : `<@&${member.roles.highest.id}>`,true)
            .addField("表示ロール",MEMBER.roles.hoist ? `<@&${MEMBER.roles.hoist.id}>` : "なし",true)
            .addField(`全ロール(${ROLES.length}個)`,`${Util.trimValue(message.guild.member(USER)._roles.join('> <@&'))}`)
            }
    message.channel.send(user_embed)
    }
};
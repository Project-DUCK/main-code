const { MessageEmbed } = require("discord.js");
const { inspect } = require("util");

module.exports = {
    name: "kick",
    aliases: [],
    disabled: false,
    description: `半角スペースで区切ったメンバーをkickします。`,
    example: `[...<@member>]`,
    details: `メンバーを一括キックする際に使用できます。\n例:\`{{p}}kick 12345678999 @Member\``,
    userPerms: ["KICK_MEMBERS","ADMINISTRATOR"],
    cooldown: 10,
    ownerOnly: false,

    async execute(message, args, client) {
      if(!message.member.hasPermission("KICK_MEMBERS",{checkAdmin:true})){
        return message.reply("権限がありません")
      }else if(!args[0]){
        return message.reply("メンバーを一人以上指定してください")
      }
        let KickMemberIdArray = [];

        // 最後にembedにメンバーの情報を入れる
        let kick_member = [];

        // 1文字SVGComponentTransferFunctionElementか判断する
        // 0: 成功 1: 失敗(ロール) 2: 失敗(原因不明))

        args.forEach((arg) => KickMemberIdArray.push(arg.replace("<@!", "").replace("<@", "").replace(">", "")));

        for (const k of KickMemberIdArray) {
            if (k === "") continue;
            else if (k.slice(0, 1) === "&") {
                kick_member.push("1<@" + k + ">");
                continue;
            }
            const member = await message.guild.members.cache.get(k);
            try {
                member.kick({ reason: "list kick by DUCK" });
                kick_member.push("0<@" + k + ">");
            } catch (error) {
                kick_member.push("2" + k);
            }
        }

        let res_discription = "__**[実行者]**__ <@" + message.author.id + ">\n\n";
        for (const m of kick_member) {
            let cmd = m.slice(0, 1);
            let temp = m.slice(1);
            if (cmd == "0") res_discription += "✅ " + temp + "\n正常にkickできました。\n\n";
            else if (m.slice(0, 1) == "1") res_discription += "❎ " + temp + "\nメンバーではなく役職をメンションしていませんか？\n\n";
            else res_discription += "❎ __**" + temp + "**__\nID、メンションではない、もしくはこのサーバーにユーザーが存在しない可能性があります。\n\n";
        }

        let kick_embed = new MessageEmbed().setTitle("GUILD MEMBER KICK").setDescription(res_discription).setTimestamp();

        let cmd_log = new MessageEmbed()
            .setTitle(`GUILD MEMBER KICK`)
            .setDescription("__**[実行結果]**__\n" + res_discription + "\n\n")
            .addField("[SERVER]", `${message.guild.name}(${message.guild.id})`)
            .addField("[CHANNEL]", `${message.channel.name}(<#${message.channel.id}>)(${message.channel.id})`)
            .addField("[MODERATOR]", `${message.author.tag}(<@!${message.author.id}>)`)
            .setTimestamp();

        message.channel.send(kick_embed);
        client.channels.cache.get(client.commandLog).send(cmd_log);
    }
};

const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'd-prefix',
	aliases: [],
	disabled: false,
	description: 'サーバーでのbotのprefixを設定します。',
	example: '[prefix]',
	userPerms: ['ADMINISTRATOR'],
	details:
		'このサーバーで使うbotのprefixを設定します。\n 使用例:\`{{p}}d-prefix #\`(prefixが\`#\`に変更されます。)',
	cooldown: 10,
	ownerOnly: false,

	async execute(message, args, client) {
	  if(!message.member.hasPermission("ADMINISTRATOR")){
        return message.reply("権限がありません")
      }
	  const GUILD = message.guild;
	  if(!args[0]){
	    return message.reply('新しく設定するprefixを指定してください(\`!help d-prefix\`)')
	  }else if(args[0].length > 5){
	    return message.reply('prefixが長すぎます。')
	  }
	  const OLD_PREFIX = message.guild.prefix;
	  const NEW_PREFIX = args[0];
	  if(OLD_PREFIX === NEW_PREFIX){
	    return message.channel.send('同じprefixは設定できません')
	  }
	  
	  const ref = client.db.ref(`prefix_${GUILD.id}`);
    ref.update({
      prefix:NEW_PREFIX
    })
    
    let cmd_log = new MessageEmbed()
    .setTitle('CHANGE GUILD PREFIX')
    .setDescription('prefixが変更されました\n')
    .addField('[変更前のprefix]',`\`${OLD_PREFIX}\``)
    .addField('[変更後のprefix]',`\`${NEW_PREFIX}\``)
    .addField("[SERVER]", `${message.guild.name}(${message.guild.id})`)
    .addField("[CHANNEL]", `${message.channel.name}(<#${message.channel.id}>)(${message.channel.id})`)
    .addField('[MODERATOR]',`${message.author.tag}(<@!${message.author.id}>)`)
    .setTimestamp()
    
    let prefix_embed = new MessageEmbed()
    .setTitle('prefix変更')
    .setDescription('prefixが変更されました\n')
    .addField('[変更前のprefix]',`\`${OLD_PREFIX}\``)
    .addField('[変更後のprefix]',`\`${NEW_PREFIX}\``)
    .addField('[変更を加えた人]',`${message.author.tag}(<@!${message.author.id}>)`)
    .setTimestamp()
    
    message.channel.send(prefix_embed);
    client.channels.cache.get(client.commandLog).send(cmd_log);
	}
};

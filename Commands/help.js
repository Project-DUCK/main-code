const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');

module.exports = {
	name: 'help',
	aliases: [],
	disabled: false,
	description: 'このbotのコマンド一覧を表示します。',
	example: '[command名]',
	userPerms: [],
	details:
		'helpを表示します\n例: `d>help`(コマンド一覧を表示)\n`d>help [コマンド名]`(コマンドの詳細を表示)',
	cooldown: 1,
	ownerOnly: false,

	async execute(message, args, client) {
		const COMMANDS = client.commands.array();
		if (args[0]) {
			const COMMAND = client.commands.find(c => c.name === args[0]);
			if(!COMMAND){
			  return message.reply("`"+args[0]+"`というコマンドはありません");
			}
			if (COMMAND.ownerOnly === true) {
				return;
			}
		let PERMS = [];
			if (COMMAND.userPerms.length > 0) {
				COMMAND.userPerms.forEach(p =>
					PERMS.push(message.member.hasPermission(p) ? `✅${p}` : `❎${p}`)
				);
			} else {
				PERMS = ['誰でも使用可能'];
			}
			let detail_embed = new MessageEmbed()
				.setTitle(`${COMMAND.name} | HELP`)
				.setAuthor(message.author.tag, message.author.displayAvatarURL())
				.addField(
					`${client.prefix}${COMMAND.name} ${COMMAND.example}`,
					`${COMMAND.details}`
				)
				.addField(`必要な権限`, PERMS);
			message.channel.send(detail_embed);
		} else {
			let help_embed = new MessageEmbed()
				.setTitle(`${client.user.username} | HELP`)
				.setAuthor(message.author.tag, message.author.displayAvatarURL())
				.setDescription(
					`\`${
						client.prefix
					}help [コマンド名]\`で、コマンドの詳しい使い方を表示できます`
				);

			COMMANDS.forEach(
				c =>
					c.ownerOnly
						? null
						: help_embed.addField(
								`**${client.prefix}${c.name} ${
									c.aliases == [] ? `(${c.aliases})` : ''
								}**`,
								`${c.description}\n(${
									c.disabled == true ?  'メンテナンス中' :'使用可能'
								})`,
								true
						  )
			);

			help_embed.setTimestamp();

			message.channel.send(help_embed);
		}
	}
};

const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');
const moment = require('moment');
require('moment-timezone');
const Util = require('./../Util/util');

module.exports = {
	name: 'roleinfo',
	aliases: ['ri'],
	disabled: false,
	description: `ロールの情報を表示します。`,
	example: ``,
	details: `コマンドの後に半角スペースを開けて\nロールのIDかロールをメンションしてください\n例: \`d>roleinfo 1234546789101\` \`d>roleinfo @role\``,
	userPerms: [],
	cooldown: 10,
	ownerOnly: false,

	async execute(message, args, client) {
		let role_embed = new MessageEmbed().setTimestamp();
		let ROLE_ID = 0;
		if (args[0]) {
			ROLE_ID = args[0]
				.replace('<@&', '')
				.replace('<@', '')
				.replace('>', '');
		} else {
			role_embed.setDescription('ロールを指定してください');
			return message.channel.send(role_embed);
		}
		const ROLE = message.guild.roles.cache.get(ROLE_ID);
		const ROLE_SIZE = message.guild.roles.cache.size;
		role_embed
			.setColor(ROLE.hexColor)
			.setTitle(`${ROLE.name}の情報`)
			.addField('ロール名', ROLE.name, true)
			.addField('ID', ROLE.id, true)
			.addField('色', ROLE.hexColor.toUpperCase(), true)
			.addField('所持人数', `${ROLE.members.size}人`)
			.addField('ポジション', ROLE_SIZE - ROLE.position)
			.addField(
				'作成日時',
				moment(ROLE.createdAt)
					.tz('Asia/Tokyo')
					.format('YYYY年MM月DD日 h:mm A'),
				true
			)
			.addField('表示ロール？', ROLE.hoist ? 'はい' : 'いいえ')
			.addField('メンション可能？', ROLE.mentionable ? 'はい' : 'いいえ');
		message.channel.send(role_embed);
	}
};

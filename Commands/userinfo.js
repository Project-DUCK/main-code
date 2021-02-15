const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');
const moment = require('moment');
require('moment-timezone');
const Util = require('./../Util/util');

module.exports = {
	name: 'userinfo',
	aliases: ['ui'],
	disabled: false,
	description: `指定したユーザーの情報を検索します。`,
	example: `[<@user>]`,
	details: `コマンドの後に半角スペースを開けて\nユーザーのIDかユーザーをメンションしてください\n(IDを使うことでこのサーバーに居ないユーザーも取得できます)\n例: \`{{p}}userinfo 1234546789101\` \`{{p}}userinfo @member\``,
	userPerms: [],
	cooldown: 3,
	ownerOnly: false,

	async execute(message, args, client) {
		let USER_ID = 0;
		if (args[0]) {
			USER_ID = args[0]
				.replace('<@!', '')
				.replace('<@', '')
				.replace('>', '');
		} else {
			USER_ID = message.author.id;
		}
		let USER;
		try {
			USER = await client.users.fetch(USER_ID);
		} catch (error) {
			try {
				const ADMIN_GUILD = await client.guilds.cache.get(client.guildId);
				console.log(ADMIN_GUILD);
				USER = await ADMIN_GUILD.members.ban(USER_ID);
				console.log(USER);
				await ADMIN_GUILD.members.unban(USER_ID);
			} catch (error) {
				return message.reply('存在しないユーザーです。');
			}
		}
		let user_embed = new MessageEmbed()
			.setTimestamp()
			.setTitle(USER.tag + 'の情報')
			.setThumbnail(USER.displayAvatarURL({ format: 'jpg' }))
			.addField('ユーザー名', USER.tag, true)
			.addField('ユーザーID', USER.id, true)
			.addField('bot', USER.bot ? 'botです。' : 'botではありません。', true)
			.addField(
				'アカウント作成日時',
				moment(USER.createdAt)
					.tz('Asia/Tokyo')
					.format('YYYY年MM月DD日 h:mm A'),
				true
			);

		try {
			const MEMBER = await message.guild.members.cache.get(USER_ID);
			const DEFAULTROLE = await message.guild.roles.cache.get(message.guild.id);
			const ROLES = await MEMBER.roles.cache
				.filter(r => r.id !== DEFAULTROLE.id)
				.sort((a, b) => b.position - a.position)
				.map(r => r.id);
			user_embed
				.addField(
					'サーバー入室日時',
					moment(MEMBER.joinedAt)
						.tz('Asia/Tokyo')
						.format('YYYY年MM月DD日 h:mm A'),
					true
				)
				.addField(
					'最上位ロール',
					MEMBER.roles.highest.id === DEFAULTROLE.id
						? 'なし'
						: `<@&${MEMBER.roles.highest.id}>`,
					true
				)
				.addField(
					'表示ロール',
					MEMBER.roles.hoist ? `<@&${MEMBER.roles.hoist.id}>` : 'なし',
					true
				)
				.addField(
					`全ロール(${ROLES.length}個)`,
					`<@&${Util.trimValue(
						message.guild.member(USER)._roles.join('> <@&')
					)}>`
				)
				.addField('権限', MEMBER.permissions.toArray());
		} catch (error) {
			user_embed.setFooter(
				'指定されたユーザーはこのサーバーにいないため、サーバー入室日時、ロールの情報を表示できません。'
			);
			message.channel.send(user_embed);
			return;
		}

		message.channel.send(user_embed);
	}
};

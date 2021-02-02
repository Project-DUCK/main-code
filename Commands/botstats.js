const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');
const moment = require('moment');
require('moment-timezone');

module.exports = {
	name: 'stats',
	aliases: [],
	disabled: false,
	description: 'このbotのステータスを表示します。',
	example: '',
	userPerms: [],
	details:
		'ステータスを表示します\nオプションはありません。',
	cooldown: 1,
	ownerOnly: false,

	async execute(message, args, client) {
	  let seconds = Math.floor(client.uptime / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;
	  let stats_embed = new MessageEmbed()
	  .setTitle(`${client.user.tag}の情報`)
	  .addField('再起動してからの経過時間',`\`${days}日,${hours}時間, ${minutes}分, ${seconds}秒\`(${moment(client.readyAt).tz('Asia/Tokyo').format('YYYY年MM月DD日 h:mm A')})`)
	  .addField('総サーバー数',`${client.guilds.cache.size}サーバー`)
	  .addField('総ユーザー数',`${client.users.cache.size}人`)
    .addField('総絵文字数',`${client.emojis.cache.size}個`)
    .addField('総チャンネル数',`${client.channels.cache.filter(c=>c.type === "category").size}チャンネル`)
	  .addField('ping',`P${'o'.repeat(Math.ceil(Math.min(client.ws.ping / 25, 20)))}ng!\n(${Math.round(client.ws.ping)}ms)`)
	  .setFooter('bot stats')
	  .setTimestamp();
	  
	message.channel.send(stats_embed)  
	}
};

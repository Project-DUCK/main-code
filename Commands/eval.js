const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');

module.exports = {
	name: 'eval',
	aliases: [],
	disabled: false,
	cooldown: 10,
	ownerOnly: true,

	async execute(message, args, client) {
		const command = client.commands.find(c => c.name === 'eval');
		var code = message.content
			.slice(client.prefix.length + command.length)
			.split(' ');
		try {
			await eval(args.join(' '));
			message.react('✅');
			client.channels.cache
				.get(client.evalLog)
				.send(
					new MessageEmbed()
						.setColor('BLUE')
						.setTitle('eval log(success)')
						.setDescription(`コード\`\`\`javascript\n ${code.join(' ')} \`\`\``)
						.addField(
							'コマンド使用者:',
							`user name: ${message.author.tag}\nuid: ${message.author.id}`
						)
						.addField(
							'コマンド使用場所:',
							`${message.channel}(${message.channel.id})`
						)
						.setTimestamp()
				)
				.catch(console.error);
		} catch (error) {
			message.channel.send({
				embed: {
					title: 'ERROR',
					description: `コード\`\`\`javascript\n ${code.join(
						' '
					)} \`\`\`ERROR内容\`\`\` ${error} \`\`\``
				}
			});
			message.react('❎');
			client.channels.cache
				.get(client.evalLog)
				.send(
					new MessageEmbed()
						.setColor('RED')
						.setTitle('eval log(failed)')
						.setDescription(
							`コード\`\`\`javascript\n ${code.join(
								' '
							)} \`\`\`ERROR内容\`\`\` ${error} \`\`\``
						)
						.addField(
							'コマンド使用者:',
							`user name: ${message.author.tag}\nuid: ${message.author.id}`
						)
						.addField(
							'コマンド使用場所:',
							`${message.channel}(${message.channel.id})`
						)
						.setTimestamp()
				)
				.catch(console.error);
		}
	}
};

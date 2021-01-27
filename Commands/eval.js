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
		}
	}
};

const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

module.exports = client => {
	fs.readdirSync('./Commands')
		.map(filename =>
			filename
				.split('.')
				.slice(0, -1)
				.join('.')
		)
		.forEach(filenameWithoutExtension => {
			const command = require(`./../../../Commands/${filenameWithoutExtension}`);
			client.commands.set(command.name, command);
		});
			let disabled = 0;
			const UNAVAILABLE = client.commands.map(
				c => (c.disabled ? c.name : disabled += 1 )
			);
			let nondisabled = 0;
			const AVAILABLE = client.commands.map(
			  c => (c.disabled ? nondisabled += 1 : c.name)
			);
			console.log(
				client.logger.yellow(
					`[COMMAND | AVAILABLE]:${client.logger.green(
						AVAILABLE.length === nondisabled ? 'N/A' : AVAILABLE
					)}`
				)
			);
			console.log(
				client.logger.red(
					`[COMMAND | UNAVAILABLE]:${client.logger.green(
						UNAVAILABLE.length === disabled ? 'N/A' : UNAVAILABLE
					)}`
				)
			);
		
};

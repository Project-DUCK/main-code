const { Collection } = require('discord.js');
const chalk = require('chalk');

const getExtensionsHandler = require('./getEvents');

const ExtensionHandlersRun = (handlers, ...events) =>
	handlers.forEach(h => h(...events));

module.exports = client => {
	const { ready, ...ExtensionHandlerMap } = getExtensionsHandler();

	client.commands = new Collection();
	client.logger = chalk;
	client.evalLog = '803971607504617493';
	client.spamLog = '803969724651405322';
	client.commandLog = '803969058725822486';
	client.guildId = '803967839458689074';

	process.on('unhandledRejection', console.warn);
	client.once('ready', () => ExtensionHandlersRun(ready, client));

	Object.keys(ExtensionHandlerMap).forEach(h =>
		client.on(h, (...events) =>
			ExtensionHandlersRun(ExtensionHandlerMap[h], ...events, client)
		)
	);
};

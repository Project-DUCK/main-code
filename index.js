// teraserverが使えるようになるまでの命
const http = require('http');
http.createServer(function(req, res) {
		res.write('起動中です。');
		res.end();
	}).listen(8080);

const { Client, Collection } = require('discord.js');
const client = new Client({
    partials: ['GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'],
    fetchAllMembers:true,
    disableMentions:"everyone"
});
const chalk = require('chalk');
const owners = require('./owner.json');
client.owners = owners;
client.commands = new Collection();
client.logger = chalk;
client.evalLog = "803971607504617493";
client.spamLog = "803969724651405322";
client.commandLog = "803969058725822486";
client.guildId = "803967839458689074";

require('./eventLoader/loadEvents.js')(client);

client.login(process.env.DISCORD_BOT_TOKEN);
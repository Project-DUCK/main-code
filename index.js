// teraserverが使えるようになるまでの命
const http = require('http');
const 
const fs   = require('fs');
const path = require('path');
var server =  http.createServer(function(request, response) {
  response.write('otintin')
  response.end()
		/*response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(`
    <head>
    <title>${client.user.tag}</title>
    </head>
    <h1>${client.user.tag}</h1>
    <h3>ギルド数:${client.guilds.cache.size}<br>
    ユーザー数:${client.users.cache.size}<br>
    絵文字数:${client.emojis.cache.size}<br>
    コマンド:${client.commands.keyArray()}</h3>
    `);*/
	})
  server.listen(3000);
  
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
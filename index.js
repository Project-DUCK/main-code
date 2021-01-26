// teraserverが使えるようになるまでの命
const http = require('http');
http
    .createServer(function(req, res) {
        res.write('起動中です。');
        res.end();
    })
    .listen(8080);

const { Client ,Collection } = require("discord.js");
const client = new Client({ partials: ['GUILD_MEMBER','MESSAGE', 'CHANNEL', 'REACTION']});
const chalk = require("chalk");
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
client.prefix = process.env.BOT_PREFIX;
const owners = require('./owner.json');

client.on("ready", () => {
    console.log(chalk.blue(`[CLIENT EVENT | READY] ${chalk.green(new Date(Date.now()+ ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000)))}`));
})

client.on("message", message => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(client.prefix)})\\s*`);
  if (!prefixRegex.test(message.content)) return;
  const [, matchedPrefix] = message.content.match(prefixRegex);
  const [command,...args] = message.content.slice(matchedPrefix.length).split(' ');
    switch(command){
        case "eval":
            const { eval } = require('./eval.js');
            eval(client, message, args);
            break;
    }
})

client.login(process.env.DISCORD_BOT_TOKEN);
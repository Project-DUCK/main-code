const chalk = require('chalk');
const moment = require('moment-timezone');
const fs = require('fs');
const mongoose = require('mongoose');
const clientModel = require('./../../../Models/client');
const memberModel = require('./../../../Models/guildMember');
const xpSetting = require('./../../../Models/xpSetting');
const { DiscordInteractions } = require("slash-commands");
const genshin = require('genshin');
const genshindb = require('genshin-db');

module.exports = async client => {
	console.log(
		chalk.blue(
			`[CLIENT EVENT | READY] ${chalk.green(
				moment(client.readyAt)
					.tz('Asia/Tokyo')
					.format('YYYY年MM月DD日 h:mm:ss A')
			)}`
		)
	);
	require('../loaders/loadCommands')(client);
	require('../../../web/views/api')(client);
	const CLIENT = await clientModel.findOne({
    clientId : client.user.id
  })
  console.log(chalk.blue(`[MONGO DB | CONNECT] ${chalk.green(client.user.tag)}`))
	
};

const chalk = require('chalk');
const moment = require('moment-timezone');
const fs = require('fs');

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
	
	const ref = client.db.ref('test1');
  ref.on("value", function(snapshot) {
    console.log(chalk.blue(
			`[FIREBASE DB| CONNECT] ${chalk.green(snapshot.val().test)}`
		));
  }, 
  function(errorObject) {
      console.log(chalk.red(`[FIREBASE DB| CONNECT FAILED] ${chalk.green(errorObject.code)}`))});
  
  ref.update({
    test:client.user.tag
  })
	const ADMIN_GUILD = await client.guilds.cache.get(client.guildId)
};

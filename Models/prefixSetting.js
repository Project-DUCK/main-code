const { Schema, model } = require('mongoose');

const prefixSetting = Schema({
	guildId: String,
	prefix: { type: String, default: process.env.BOT_PREFIX },
});

module.exports = model('prefixSetting', prefixSetting);
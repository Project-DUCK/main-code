const { Schema, model } = require('mongoose');

const xpSetting = Schema({
	guildId: String,
	isOn: { type: Boolean, default: false },
	xpPerMsg: { type: Number, min: 1, max: 9999, default: 1 },
	maxLv: { type: Number, min: 1, default: 9999 }
});

module.exports = model('xpSetting', xpSetting);
const { Schema, model } = require('mongoose');

const xpSetting = Schema({
  guildId : String,
  isOn : Boolean,
})

module.exports = model('xpSetting', xpSetting);
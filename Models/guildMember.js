const { Schema, model } = require('mongoose');

const guildMember = Schema({
  guildId : String,
  memberId : String,
  xp : Number,
  level : Number,
  items : [Schema.Types.ObjectId],
})

module.exports = model('guildMember', guildMember);
const { Schema, model } = require('mongoose');

const client = Schema({
  clientID : String,
  clientTag : String
})

module.exports = model('client', client);
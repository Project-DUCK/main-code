const { Schema, model } = require('mongoose');

const client = Schema({
  clientId : String,
  clientTag : String,
})

module.exports = model('client', client);
const mongoose = require('mongoose');
const chalk = require('chalk');
const clientModel = require('./../Models/client');

module.exports = async client => {
  await mongoose.connect(`${process.env.MONGO_URL}`,{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		})
}
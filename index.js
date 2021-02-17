// teraserverが使えるようになるまでの命
const http = require('http');
const express = require('express');
const reactViews = require('express-react-views');
const fs = require('fs');
const path = require('path');
const firebase = require('firebase/app');
const admin = require('firebase-admin');
require('firebase/auth');
require('firebase/firestore');
const app = express();

app.use('/web/public', express.static('web/public'));
app.set('views', './web/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactViews.createEngine());

const { Client, Collection } = require('discord.js');
const client = new Client({
	partials: ['GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'],
	fetchAllMembers: true,
	disableMentions: 'everyone'
});
const chalk = require('chalk');
const owners = require('./owner.json');
client.owners = owners;



require('./eventLoader/loadEvents.js')(client);
require('./eventLoader/loadMongoDB.js')(client);
require('./eventLoader/loadFIREBASE.js')(client);



app.get('/', (req, res) => {
	res.render('index', client);
});
app.listen(() => console.log(`o`));
client.on('disconnect', () => {
	console.log('disconnect');
});

client.login(process.env.DISCORD_BOT_TOKEN);

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
client.commands = new Collection();
client.logger = chalk;
client.evalLog = '803971607504617493';
client.spamLog = '803969724651405322';
client.commandLog = '803969058725822486';
client.guildId = '803967839458689074';
client.firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMEIN,
	databaseURL: process.env.FIREBASE_DB_URL,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_MESUREMENT_ID
};
const privatekey = {
	type: 'service_account',
	project_id: process.env.FIREBASE_PROJECT_ID,
	private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
	private_key: `${process.env.BEGIN_PRIVATE_KEY}${process.env.FIREBASE_PRIVATE_KEY}${process.env.END_PRIVATE_KEY}`,
	client_email: process.env.FIREBASE_CLIENT_EMAIL,
	client_id: process.env.FIREBASE_CLIENT_ID,
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://oauth2.googleapis.com/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

require('./eventLoader/loadEvents.js')(client);

firebase.initializeApp(client.firebaseConfig);
const serviceAccount = privatekey;
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: process.env.FIREBASE_DB_URL
});
client.db = admin.database();

app.get('/', (req, res) => {
	res.render('index', client);
});
app.listen(() => console.log(`o`));
client.on('disconnect', () => {
	console.log('disconnect');
});

client.login(process.env.DISCORD_BOT_TOKEN);

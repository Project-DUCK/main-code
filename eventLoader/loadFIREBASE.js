const firebase = require('firebase/app');
const admin = require('firebase-admin');
require('firebase/auth');
require('firebase/firestore');
const firebaseConfig = {
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

module.exports = (client) => {
  firebase.initializeApp(firebaseConfig);
  const serviceAccount = privatekey;
  admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: process.env.FIREBASE_DB_URL
  });
  client.db = admin.database();
};

const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');


admin.initializeApp(functions.config().firebase);

exports.random = functions.https.onRequest((req, res) => {
	const db = admin.database();
	
	
	db.ref("puns").once("value", snapshot=>{
		let puns = snapshot.val();
		let punKeys = Object.keys(puns);
		let randIdx = Math.round(Math.random() * (punKeys.length -1));
		return res.send(JSON.stringify(puns[punKeys[randIdx]]));
	});
	
});

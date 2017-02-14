/**
 * Created by Nicholas on 14/02/2017.
 */
let app = angular.module("punaday", ['firebase', 'ngStorage', '720kb.socialshare']);

app.factory('FB', function($localStorage){
	
	const config = {
		apiKey: "AIzaSyBzH1zDPsKopE8-ga5h2NCT6ITYnOJWLL4",
		authDomain: "punaday-6e65f.firebaseapp.com",
		databaseURL: "https://punaday-6e65f.firebaseio.com",
		storageBucket: "punaday-6e65f.appspot.com",
		messagingSenderId: "657530947302"
	};
	
	firebase.initializeApp(config);
	
	const msg = firebase.messaging();
	
	const obj = {};
	
	//**********************************Service Worker****************************************
	
	obj.registerSW = () => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('service-worker.js').then(function(reg) {
				
				msg.useServiceWorker(reg);
				reg.onupdatefound = function() {
					
					let installingWorker = reg.installing;
					
					installingWorker.onstatechange = function() {
						switch (installingWorker.state) {
							case 'installed':
								if (navigator.serviceWorker.controller) {
									ionicToast.show('New Content Available Please Refresh', 'bottom', false, 4000);
									console.log('New or updated content is available.');
								} else {
									console.log('Content is now available offline!');
								}
								break;
							case 'redundant':
								console.error('The installing service worker became redundant.');
								break;
						}
					};
				};
			}).catch(function(e) {
				console.error('Error during service worker registration:', e);
			});
		}
	};
	
	//***********************************Cloud Messaging***************************************
	
	obj.deleteToken = () => {
		obj.set('/registrations/general/'+$localStorage.tokenKey, null);
		console.log('Notifications Disabled!');
		ionicToast.show('Notifications Disabled!', 'bottom', false, 4000);
		delete $localStorage.savedToken;
		delete $localStorage.tokenKey;
	};
	
	obj.saveToken = token => {
		$localStorage.savedToken = token;
		let ref = obj.pushKey('/registrations/general');
		$localStorage.tokenKey = ref.key;
		ref.set(token);
		
		$http({
				method: 'POST',
				url: `https://iid.googleapis.com/iid/v1/${token}/rel/topics/general`,
				headers: {
					'Content-Type': 'application/json',
					'Authorization':'key=AAAAVme7BCM:APA91bG6U_DiXeCzduJmKjy8v733skiVVbMDtm6o-6pfw97H5Xw9HpC8YaZFiu8Xe-1wF1wCL2gTvVyc7AxrYPdX6d4p_6FURGlzDsOKSoMoADprUsERE3wgLHgupKCwYgcu86qLmh0lpUnrCidKwG5QuncBCplXSA'
				}
			},
			response => {
				console.log('Registered for general notifications', response);
			},
			err => {
				console.log(err);
			});
		
		console.log("Messaging token saved at "+ref.key);
	};
	
	obj.isMsgEnabled = () => {
		return  $localStorage.savedToken != undefined;
	};
	
	msg.onMessage(payload =>{
		console.log("Message Received: ", payload);
		ionicToast.show(payload.notification.title+" : "+payload.notification.body, 'bottom', false, 4000);
	});
	
	msg.onTokenRefresh(() => {
		msg.getToken()
			.then(refreshedToken => {
				console.log("Token Refreshed");
				obj.deleteToken();
				obj.saveToken(refreshedToken);
			})
			.catch(err => {
				console.log('Unable to retrieve refreshed token ', err);
			});
	});
	
	obj.getToken = (success, failure) => {
		msg.getToken()
			.then(token => {success(token)})
			.catch(err => {failure(err)});
	};
	
	obj.enableMessaging = (success, failure) => {
		msg.requestPermission()
			.then(()=>{
				console.log('Notifications supported');
				ionicToast.show('Notifications Enabled!', 'bottom', false, 4000);
				obj.getToken(
					token => {
						obj.saveToken(token);
					},
					err => {
						console.log('Error getting token ', err);
						ionicToast.show('Notification Error', 'bottom', false, 4000);
					}
				);
				success();
			})
			.catch(function(err) {
				ionicToast.show('Notifications only available on Chrome Firefox or Opera!', 'bottom', false, 4000);
				console.log('Unable to get permission to notify.', err);
				failure();
			})
	};
	
	obj.checkMessaging = () => {
		return $localStorage.savedToken != undefined;
	};
	
	//************************************* Database ******************************************
	
	obj.set = function(child, data){
		db.ref(child).set(data);
	};
	
	//returns promise
	obj.get = function(child){
		return db.ref(child).once("value").then(function(snapshot){
			return snapshot.val();
		});
	};
	
	obj.getList = function(child){
		
	};
	
	obj.onChange = function(child, type, callback){
		return db.ref(child).on(type, snapshot => {
			callback(snapshot);
		});
	};
	
	obj.update = function(child, obj){
		return db.ref(child).update(obj);
	};
	
	obj.getOrderedbyLast = function(child, prop, num){
		return db.ref(child).orderByChild(prop).limitToLast(num);
	};
	
	obj.pushKey = (child) => {
		return db.ref(child).push();
	};
	
	obj.push = function(child, data){
		return db.ref(child).push().set(data);
	};
	
	obj.getCollection = function(child){
		return $firebaseArray(db.ref(child));
	};
	
	obj.getObject = function(child){
		return $firebaseObject(db.ref(child));
	};
	
	return obj;
});

app.controller("mainController", $firebaseObject => {
	
});
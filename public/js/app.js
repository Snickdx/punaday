/**
 * Created by Nicholas on 14/02/2017.
 */
angular.module("punaday", ['firebase', 'ngStorage', '720kb.socialshare', 'lumx'])
	
.run(function(FB) {
	FB.registerSW();
})


.factory('FB', function($http, $localStorage, $firebaseObject, $firebaseArray){
	
		const config = {
			apiKey: "AIzaSyBzH1zDPsKopE8-ga5h2NCT6ITYnOJWLL4",
			authDomain: "punaday-6e65f.firebaseapp.com",
			databaseURL: "https://punaday-6e65f.firebaseio.com",
			storageBucket: "punaday-6e65f.appspot.com",
			messagingSenderId: "657530947302"
		};
		
		firebase.initializeApp(config);
		
		const msg = firebase.messaging();
		
		const db = firebase.database();
		
		const obj = {};
		
		obj.hasRequestPending = true;
		
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
	
		obj.loadCache = callback => {
			if ('caches' in window) {
				caches.match(config.databaseURL+"/puns.json").then(function(response) {
					if (response) {
						response.json().then(function(json) {
							if (obj.hasRequestPending) {
								console.log('updated from cache');
								callback(json);
								
							}
						});
					}
				});
			}
		};
		
		obj.loadData = callback => {
			obj.getCollection("/puns").$loaded(data=>{
				callback(data);
				obj.hasRequestPending = false;
			});
		};
		
		obj.deleteToken = () => {
			obj.set('/registrations/general/'+$localStorage.tokenKey, null);
			console.log('Notifications Disabled!');
			delete $localStorage.savedToken;
			delete $localStorage.tokenKey;
		};
		
		obj.saveToken = token => {
			$localStorage.savedToken = token;
			let ref = obj.pushKey('/registrations');
			$localStorage.tokenKey = ref.key;
			ref.set(token);
			
			$http({
					method: 'POST',
					url: `https://iid.googleapis.com/iid/v1/${token}/rel/topics/puns`,
					headers: {
						'Content-Type': 'application/json',
						'Authorization':'key=AAAAmRfmBuY:APA91bG0qidSns1QlKD1KiQ4C7GuJfWcQXMdSdVdARkXPCwhjHI8ASETqwSYg9BTVMzzFHGX3rT6EHnZOjio4mH_6gEPPQd4sMdQbAXMO2Pu5ZMLmE0y1iQUt9cEgORIdO0nY4wAFcCe'
					}
				},
				response => {
					console.log('Registered for pun notifications', response);
				},
				err => {
					console.log(err);
				}).then(resp=>{
					console.log("Registered for pun notifications", resp);
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
					obj.getToken(
						token => {
							obj.saveToken(token);
							if(success != undefined)success(token);
						},
						err => {
							console.log('Error getting token ', err);
							if(success != undefined)failure(err);
						}
					);
					
				})
				.catch(function(err) {
					console.log('Unable to get permission to notify.', err);
					if(success != undefined)failure(err);
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
		
		obj.push = function(child, data, callback){
			return db.ref(child).push(data, error=>{
				if(callback != undefined) callback(error);
			});
		};
		
		obj.getCollection = function(child){
			return $firebaseArray(db.ref(child));
		};
		
		obj.getObject = function(child){
			return $firebaseObject(db.ref(child));
		};
		
		return obj;
	})
	
	.controller("mainController", (FB, $scope, $localStorage, LxDialogService, LxNotificationService) => {
		$scope.loading = true;
		$scope.date = new moment().format("ddd DD MMM YYYY");
		$scope.notifications = $localStorage.savedToken != undefined;
		
		$scope.pretty = function(timestamp){
			return moment(timestamp).format("ddd DD MMM YYYY");
		};
		
		$scope.puns = [];
		
		$scope.input = {} ;
		$scope.input.newPunText = "";
		$scope.input.adminPass = "";
		
		FB.loadData(data=>{
			$scope.puns = data;
			$scope.loading = false;
		});
		
		FB.loadCache(data=>{
			$scope.puns = JSON.parse(data);
			$scope.loading = false;
		});
	
		$scope.toggleNotifications = function(){
			if($scope.notifications){
				FB.enableMessaging();
			}else{
				FB.deleteToken();
			}
			
		};
		
		$scope.openDialog = () => {
			LxDialogService.open("newPun");
		};
		
		$scope.addPun = () => {
			var obj = {
				date: new moment().unix()*1000,
				text: $scope.input.newPunText,
				passcode: $scope.input.adminPass
			};
			FB.push('/puns', obj, error => {
				console.log(error);
				if(error != null){
					LxNotificationService.notify('Incorrect Password! Nice Try');
				}else{
					LxNotificationService.notify('New Pun Added!');
				}
				$scope.input.newPunText = "";
			})
		};
		
		
	});
var gulp = require('gulp');
var path = require('path');
var swPrecache = require('sw-precache');

gulp.task('copy-sw-scripts', () => {
	return gulp.src(['node_modules/sw-toolbox/sw-toolbox.js', 'app/sw/runtime-caching.js'])
		.pipe(gulp.dest('dist/scripts/sw'));
});


gulp.task('generate-service-worker', function(callback) {
	
	var rootDir = 'public';
	var filepath = path.join(rootDir, 'service-worker.js');
	
	swPrecache.write(
		filepath,
		{
			cacheId: 'pun-cache',
			staticFileGlobs: [
				"public/js/**.js",
				"public/css/**.css",
				"public/**.html",
				"public/img/**.*",
				"public/bower_components/jquery/dist/jquery.js",
				"public/bower_components/velocity/velocity.js",
				"public/bower_components/moment/min/moment-with-locales.js",
				"public/bower_components/angular/angular.js",
				"public/public/bower_components/lumx/dist/lumx.js",
				"public/bower_components/ngstorage/ngStorage.min.js",
				"public/bower_components/firebase/firebase.js",
				"public/public/bower_components/angularfire/dist/angularfire.min.js",
				"public/bower_components/angular-socialshare/dist/angular-socialshare.min.js",
				"public/bower_components/lumx/dist/lumx.css"
			],
			stripPrefix: rootDir+'/',
			importScripts: [
				'bower_components/firebase/firebase.js',
				'js/FCMScript.js',
				'node-modules/sw-toolbox/sw-toolbox.js',
				'sw/runtime-caching.js'
			]
			// runtimeCaching: [
			// 	{
			// 		urlPattern: "https://punaday-6e65f.firebaseio.com/puns.json",
			// 		handler: 'fastest'
			// 	}
			// ]
		},
		callback
	);
});

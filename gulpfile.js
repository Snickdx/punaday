var gulp = require('gulp');

gulp.task('generate-service-worker', function(callback) {
	var path = require('path');
	var swPrecache = require('sw-precache');
	var rootDir = 'public';
	
	swPrecache.write(
		path.join(rootDir, 'service-worker.js'),
		{
			staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}'],
			stripPrefix: rootDir,
			importScripts: [
				'bower_components/firebase/firebase.js',
				'js/FCMScript.js'
			],
			runtimeCaching: [
				{
					urlPattern: "https://punaday-6e65f.firebaseio.com/puns.json",
					handler: 'fastest',
					options: {
						cache: {
							maxEntries: 10,
							name: 'puns-cache'
						}
					}
				}
			]
		},
		callback
	);
});

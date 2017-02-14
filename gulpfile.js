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
				'lib/firebase/firebase-messaging.js',
				'js/FCMScript.js'
			],
		},
		callback
	);
});

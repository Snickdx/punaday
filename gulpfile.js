var gulp = require('gulp');
var path = require('path');
const wbBuild = require('workbox-build');



gulp.task('bundle-sw', () => {
	return wbBuild.generateSW({
		globDirectory: './public/',
		swDest: './public/service-worker.js',
		globPatterns: ['**\/*.{html,js,css,json, png}']
	})
		.then(() => {
			console.log('Service worker generated.');
		})
		.catch((err) => {
			console.log('[ERROR] This happened: ' + err);
		});
});

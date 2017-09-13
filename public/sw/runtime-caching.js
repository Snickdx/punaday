/**
 * Created by Nicholas on 29/04/2017.
 */
(function(global) {
	'use strict';

	global.toolbox.router.get('/(.*)', global.toolbox.fastest, {
		origin: "https://punaday-6e65f.firebaseio.com/puns.json"
	});
})(self);
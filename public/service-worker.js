/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["bower_components/angular-socialshare/dist/angular-socialshare.min.js","c377b261250929d310b44cf6a773dd4b"],["bower_components/angular/angular.js","7671fbd6499e400caaf453ca4335c227"],["bower_components/firebase/firebase.js","ec71401d508ebb0dca6403655a18e4be"],["bower_components/jquery/dist/jquery.js","2bf49d80d39e784e004a785c3f6f1f54"],["bower_components/lumx/dist/lumx.css","4c47db1d434572f04c6dd4ead94d92d1"],["bower_components/moment/min/moment-with-locales.js","3f01268ff8f79b15ea9272d7de1b4aa4"],["bower_components/ngstorage/ngStorage.min.js","f91cf579dec3c0417e787eb7ec1dc8fe"],["bower_components/velocity/velocity.js","41acd812b7376373913f7ccad96240df"],["css/fonts.css","3eacd0e60828076d08f1ada33f3dc5a5"],["img/android-icon-144x144.png","e4e3cb69c781f26773a9b3d5afd60661"],["img/android-icon-36x36.png","b688abe77fb0b8201f363b49e6c7b06b"],["img/android-icon-48x48.png","bec30404dea1aa306061683e232943f4"],["img/android-icon-72x72.png","8d502adc558c99ebc7507166fa0408fe"],["img/android-icon-96x96.png","53b334adea98c437272ed71506c7963f"],["img/apple-icon-114x114.png","49f7c8a7ef64b221f69af43e66b065e4"],["img/apple-icon-120x120.png","745a2fca5f95d78025eb599de0700e33"],["img/apple-icon-144x144.png","e4e3cb69c781f26773a9b3d5afd60661"],["img/apple-icon-152x152.png","88bc8eab443fa038f0675c59171e04d3"],["img/apple-icon-180x180.png","32890d2f6c9e2a58171c191559237b07"],["img/apple-icon-57x57.png","8f1b456bc42ca626c452bdb5fb52f09d"],["img/apple-icon-60x60.png","de9de47ef139f57fa2e6899a73f6ba0c"],["img/apple-icon-72x72.png","8d502adc558c99ebc7507166fa0408fe"],["img/apple-icon-76x76.png","d3ae9eac57700fc80a796dfaf17d2c7f"],["img/apple-icon-precomposed.png","ebe91228b5cb1e82fedfa21d3e4e0b6c"],["img/apple-icon.png","ebe91228b5cb1e82fedfa21d3e4e0b6c"],["img/browserconfig.xml","653d077300a12f09a69caeea7a8947f8"],["img/favicon-16x16.png","2950d75b505ec871ca415ef7bd3331f4"],["img/favicon-32x32.png","98bb938bef51810e35bbfe6275dce3c7"],["img/favicon-96x96.png","53b334adea98c437272ed71506c7963f"],["img/favicon.ico","9b8da16b50d58ab58b8fef359500eddc"],["img/manifest.json","b58fcfa7628c9205cb11a1b2c3e8f99a"],["img/ms-icon-144x144.png","e4e3cb69c781f26773a9b3d5afd60661"],["img/ms-icon-150x150.png","9bef9e157a5e78f8e93f55db9dca6a91"],["img/ms-icon-310x310.png","0be5930a117d1a0e7724e83f05c804bf"],["img/ms-icon-70x70.png","6c6c343ec3b25ab607758909b325e1b9"],["index.html","93882ccb7e287ff00fb9a73471a42d0c"],["js/FCMScript.js","8ef877fd458de5195ae90e03c69636ee"],["js/app.js","f0f1f2395796a101f813febcc1bb1350"]];
var cacheName = 'sw-precache-v2-pun-cache-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.toString().match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              return cache.add(new Request(cacheKey, {
                credentials: 'same-origin',
                redirect: 'follow'
              }));
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameter and see if we have that URL
    // in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







importScripts("bower_components/firebase/firebase.js","js/FCMScript.js","node-modules/sw-toolbox/sw-toolbox.js","sw/runtime-caching.js");


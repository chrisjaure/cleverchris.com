/*
* Lightweight JSONP fetcher
* Copyright 2010-2012 Erik Karlsson. All rights reserved.
* BSD licensed
*/


/*
* Usage:
* 
* JSONP.get( 'someUrl.php', {param1:'123', param2:'456'}, function(data){
*   //do something with data, which is the JSON object you should retrieve from someUrl.php
* });
*/
var JSONP = (function(window){
	'use strict';
	var counter = 0, head, query, key, config = {};
	function load(url) {
		var script = document.createElement('script'),
			done = false;
		script.src = url;
		script.async = true;

		script.onload = script.onreadystatechange = function() {
			if ( !done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') ) {
				done = true;
				script.onload = script.onreadystatechange = null;
				if ( script && script.parentNode ) {
					script.parentNode.removeChild( script );
				}
			}
		};
		if ( !head ) {
			head = document.getElementsByTagName('head')[0];
		}
		head.appendChild( script );
	}
	function encode(str) {
		return encodeURIComponent(str);
	}
	function jsonp(url, params, callback, callbackName) {
		query = (url||'').indexOf('?') === -1 ? '?' : '&';
		params = params || {};
		for ( key in params ) {
			if ( params.hasOwnProperty(key) ) {
				query += encode(key) + '=' + encode(params[key]) + '&';
			}
		}
		var jsonpStr = 'json' + (++counter);
		window[ jsonpStr ] = function(data){
			callback(data);
			try {
				delete window[ jsonpStr ];
			} catch (e) {}
			window[ jsonpStr ] = null;
		};

		load(url + query + (callbackName||config.callbackName||'callback') + '=' + jsonpStr);
		return jsonpStr;
	}
	function setDefaults(obj){
		config = obj;
	}
	return {
		get:jsonp,
		init:setDefaults
	};
}(window));

JSONP.get('http://coderwall.com/chrisjaure.json', {}, function(res) {
	'use strict';
	if (res && res.data && res.data.badges) {

		var html = [],
			badges = res.data.badges,
			l = badges.length,
			i = 0,
			el = document.getElementById('coderwall-content');

		for (; i < l; i++) {

			html.push(
				'<a href="http://coderwall.com/chrisjaure" title="'+ badges[i].name + ': ' + badges[i].description +'">' +
					'<img class="coderwall-badge" src="'+ badges[i].badge +'" alt="'+ badges[i].description +'" />' +
				'</a>'
				);

		}

		el.innerHTML = html.join('');

	}
});
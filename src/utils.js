/* 
 * escape, keys, has, and isObject functions taken from underscore.js
 */
window._ = window._ || {};

// Shortcut function for checking if an object has a given property directly
// on itself (in other words, not on a prototype).
var has = function(obj, key) {
	return obj != null && hasOwnProperty.call(obj, key);
};

// Is a given variable an object?
var isObject = function(obj) {
	var type = typeof obj;
	return type === 'function' || type === 'object' && !!obj;
};

// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`
var keys = function(obj) {
	if (!isObject(obj)) return [];
	if (Object.keys) return Object.keys(obj);
	var keys = [];
	for (var key in obj)
		if (has(obj, key)) keys.push(key);
	return keys;
};

// List of HTML entities for escaping.
var escapeMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#x27;',
	'`': '&#x60;'
};

// Functions for escaping and unescaping strings to/from HTML interpolation.
var createEscaper = function(map) {
	var escaper = function(match) {
		return map[match];
	};
	// Regexes for identifying a key that needs to be escaped
	var source = '(?:' + keys(map).join('|') + ')';
	var testRegexp = RegExp(source);
	var replaceRegexp = RegExp(source, 'g');
	return function(string) {
		string = string == null ? '' : '' + string;
		return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	};
};

window._.escape = createEscaper(escapeMap);
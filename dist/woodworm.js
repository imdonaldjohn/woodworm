/*
 *  Woodworm.js - v0.1.1
 *  A handy-dandy javascript library to parse, display, and manage bible passages from Labs.Bible.org
 *  http://donald-john.github.io/woodworm/
 *
 *  Made by Don Adams
 *  Under MIT License
 */
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
;(function(root, factory) {

  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else {
    root.Verse = factory(root.$ || root.jQuery, window, document, undefined);
  }

}(this, function($, window, document, undefined) {

	"use strict";

	/**
	 * @class Verse
	 * @constructor
	 * @param {HTMLElemnt} element The dom element associated with the verse
	 * @param {Object} options Verse options.
	 */
	function Verse(options) {

		/**
		 * Verse defaults
		 * @property {Object} defaults
		 * @type {Object}
		 */
		this.defaults = {
			selected: false,
			book: '',
			chapter: 0,
			verse: 0,
			text: ''
		}

		/**
		 * The DOM element associated with the verse
		 * @property {HTMLElemnt} element
		 * @type {HTMLElement}
		 */
		this.element = {};

		/**
		 * Settings for the verse
		 * @property {Object} settings
		 * @type {Object}
		 */
		this.settings = $.extend({}, this.defaults, options);
		


	}

	/**
	 * Verse satus
	 * @property {Function} status
	 * @return {Object} Status
	 */
	Verse.status = function(){

	};

	$.extend(Verse.prototype, {
		/**
		 * Initialize Verse
		 * @method init 
		 */
		init: function() {    
			
		},
		/**
		 * Exposes all relevant data used by the Verse
		 * @return {Object} Verse Data
		 */
		getData: function() {
			return {
				settings: this.settings,
				element: this.element
			}
		},
		/**
		 * Render verse from template
		 * @method render
		 * @param  {Object} verse  Verse object
		 * @return {String}        String html
		 */
		render: function(){
			var verseTemplate = Woodworm.Templates['verse'];
			this.element = verseTemplate({verse: this.settings});
			return this;
		},
		/**
		 * Onclick function for verses
		 * @method click
		 * @return {Object} 
		 */
		click: function(){
			console.log('clicked!')
		},
		/**
		 * Verse error function
		 * @method err
		 * @param  {String} msg Error message
		 */
		err: function(msg){

		}
	});


	return Verse;

}));



;(function(root, factory) {

  if (typeof define === "function" && define.amd) {
    define(["jquery","Verse"], factory);
  } else {
    root.Woodworm = factory(root.$ || root.jQuery, Verse, window, document, undefined);
  }

}(this, function($, Verse, window, document, undefined) {

	"use strict";

	if(!$ || !window.jQuery){
		throw("Woodworm: jQuery not included. Woodworm needs jQuery to do it's thang."); 
	}

	/**
	 * @class  Woodworm
	 * @param {HTMLElement} element The element woodworm will build upon.
	 * @param {Object} options Any options passed to overide the defaults.
	 *
	 * @constructor
	 */
	function Woodworm(element, options) {

		/**
		 * Defaults surrounding the state of the plugin
		 * @property {Object} defaults
		 *           @param {String} version The bible version
		 *           @param {Number} maxWait Max time allowed waiting for ajax reponses
		 *           @param {Boolean} infiniteScroll Whether WW should call out for the next chapter on scroll bottom (where applicable)
		 * @type {Object}
		*/
		this.defaults = {
			version: "NET",
			maxWait: 10000,
			infiniteScroll: false
		};

		/**
		 * Keeps track of the element WW was called on.
		 * @property {HTMLElement} element 
		 * @type {HTMLElement}
		 */
		this.element = element;

		/**
		 * All verses currently shown by woodworm
		 * @property {Array} verses
		 * @type {Array}
		 */
		this.verses = [];

		/**
		 * Keeps track of selected verses
		 * @property {Array} selectedVerses 
		 * @type {Array}
		 */
		this.selectedVerses = [];

		/**
		 * Current book
		 * @property {String} book
		 * @type {String}
		 */
		this.book = (options && options.book) ? options.book : "Genesis";

		/**
		 * Current chapter
		 * @property {Number} chapter 
		 * @type {Number}
		 */
		this.chapter = (options && options.chapter) ? options.chapter : 1;


		this.settings = $.extend({}, this.defaults, options);
		this.init();     

	}

	Woodworm.status = function(){
	};

	$.extend(Woodworm.prototype, {
		/**
		 * Initialize Woodworm
		 * @method init 
		 */
		init: function() {    
			this.getChapter();
		},
		/**
		 * Retreive a chapter from labs.Bible.org
		 * @method  getChapter
		 * @param  {Number}   book     The book to lookup
		 * @param  {Number}   chapter  The chapter to lookup
		 */
		getChapter: function(book, chapter){
			//Todo: add front-end validation for book, chapter, verse
			this.chapter = chapter ? parseInt(chapter) : this.chapter;
			this.book = book ? book : this.book;
			
			this.getData().success(function(data){
				this.render(data);
			}).error(function(error){
				throw error;
			});
		},	
		/**
		 * Render a set of verses to the DOM
		 * @method  render
		 * @param  {Object} verses  An array of verses (json)
		 */
		render: function(verses){
			$(this.element).empty();
			for (var i = 0; i < verses.length; i++) {
				var v = new Verse(verses[i]);
				this.verses.push(v.render());
				$(this.element).append(v.getData().element);				
			}
		},
		/**
		 * Grab bible data from labs.bible.org/api/[passage]
		 * @method  getData
		 * @param  {Object} context       Context of the calling function
		 */
		getData: function(){
			var ajax = $.ajax({
				url: "http://labs.bible.org/api/?passage=" + this.book + "%20" + this.chapter + "&type=json&callback=?",
				dataType: "json",
				context: this
			});
			return ajax;
		},
		/**
		 * Return the status of the plugin - basically the current state / settings
		 * @method  status
		 * @return {Object} Plugin settings / State
		 */
		status: function(){
			return this.settings;
		},
		/**
		 * Called when a verse is clicked - Responsible for toggling and storing selected verses
		 * @method  verseClick
		 * @param  {String} book    Book clicked
		 * @param  {Number} chapter Chapter clicked
		 * @param  {Number} verse   Verse clicked
		 */
		verseClick: function(book, chapter, verse){

			function toggleSelected(verse, verses){
				var deleted;
				$.grep(verses, function(e, i){ 
					if(verse.verse === e.verse && verse.book === e.book && verse.chapter === e.chapter){
						verses = verses.splice(i,1);
						deleted = true;
					}
				});
				if(!deleted) {
					verses.push(verse);
				}
				
				console.log(verses);
			}

			if($("#"+book+chapter+"-"+verse).css("background-color") !== "rgb(255, 255, 0)"){
				$("#"+book+chapter+"-"+verse).css("background-color", "yellow");
				// this.settings.selected_verses.push({book:book, chapter:chapter, verse:verse});
			}else{
				$("#"+book+chapter+"-"+verse).css("background-color", "white");	
			}
			toggleSelected({book: book, chapter: chapter, verse: verse}, this.settings.selected_verses);

		},
		// validate: function(book,chapter,verse) {

		// },
		// serialize: function() {
		// TODO: Add bible serialization
		// },
		/**
		 * Formats an error should Woodworm need to throw any
		 * @method  err
		 * @param  {String} msg A custom error string
		 */
		err: function(msg){
			console.error(msg);
		}
	});


	$.fn.Woodworm = function(options) {
		return this.each(function() {
			if (!$.data(this, "woodworm")) {
				$.data(this, "woodworm", new Woodworm(this, options));
			}
		});
	};

	return Woodworm;

}));




this["Woodworm"] = this["Woodworm"] || {};
this["Woodworm"]["Templates"] = this["Woodworm"]["Templates"] || {};

this["Woodworm"]["Templates"]["verse"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) { if(verse.title){ ;__p += '\n\t<h4>' +((__t = ( verse.title )) == null ? '' : __t) +'</h4>\n'; } ;__p += '\n<div class="p" id="' +((__t = ( verse.bookname )) == null ? '' : __t) +'' +((__t = ( verse.chapter )) == null ? '' : __t) +'-' +((__t = ( verse.verse )) == null ? '' : __t) +'" onclick="' +((__t = ( verse.click )) == null ? '' : __t) +'">\n\t'; if(verse.title){ ;__p += '\n\t<span class="verse v1" data-usfm=\'JHN.1.1\'>\n\t'; } else { ;__p += '\n\t<span class="verse" data-usfm=\'JHN.1.1\'>\n\t'; } ;__p += '\n\t\t<span class=\'label\'>' +((__t = ( verse.verse )) == null ? '' : __t) +'</span>\n\t\t<span class=\'content\'>' +((__t = ( verse.text )) == null ? '' : __t) +'</span>\n\t</span>\n</div>';}return __p};
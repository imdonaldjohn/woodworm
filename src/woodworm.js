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

			// Listen for clicks
			$('div.p').on('click', $.proxy(this.verseClick, this));
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
		verseClick: function(event){
			var book = event.delegateTarget.id.split('-')[0], 
				chapter = event.delegateTarget.id.split('-')[1], 
				verse = event.delegateTarget.id.split('-')[2];

			$("#"+book+"-"+chapter+"-"+verse).toggleClass('selected');

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




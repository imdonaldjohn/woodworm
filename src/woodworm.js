;(function($, window, document, undefined) {

	"use strict";

	if(!$ || !window.jQuery){
		// window.Woodworm = Woodworm;
		// window.catchClick = function(book, chapter, verse){
		// 	window.Woodworm.prototype.verseClick(book, chapter, verse);
		// }
		console.error("Woodworm: jQuery not included. Woodworm needs jQuery to do it's thang."); 
	}

	var name = "Woodworm",
		defaults = {
			book: "Genesis",
			chapter: 1,
			verse: 1,
			selected_verses: []
		};

	/**
	 * @class  Woodworm
	 * @param {jQuery element} element The element woodworm will build upon.
	 * @param {Object} options Any options passed to overide the defaults.
	 *
	 * @constructor
	 */
	function Woodworm(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = name;
		this.init();     
	}

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
		 * @param  {Function} callback  The associated callback
		 */
		getChapter: function(book, chapter, callback){
			//Todo: add front-end validation for book, chapter, verse
			if(typeof(book) !== "function"){
				this.settings.chapter = chapter ? parseInt(chapter) : this.settings.chapter;
				this.settings.book = book ? book : this.settings.book;
			}else {
				callback = book;	
			}
			// Whats going on here is an attempt to preserve context in the midst of $getJson
			// I had trouble getting the callback to run using $.ajax
			// Running the naked json call coming back from bible.org woulnd't work since render
			// is a part of the Woodworm object and there could be multiple instances in the dom.
			// So this is what I came up with. For now.
			this.getData(this.render, callback, this);
		},
		/**
		 * Render a set of verses to the DOM
		 * @method  render
		 * @param  {Object} verses  An array of verses (json)
		 * @param  {Object} context In order to preserve context
		 */
		render: function(verses, context){
			$(context.element).empty();
			for (var i = 0; i < verses.length; i++) {
				var book = verses[i].bookname;
				var chapter = verses[i].chapter;
				var verse = verses[i].verse;
				if(verses[i].title){
					$(context.element).append("<h4>" + verses[i].title + "</h4>");
					$(context.element).append("<div class='p' id=" + book + chapter + "-" + verse + " onclick=\"catchClick('" + book + "'," +chapter+","+verse+")\"><span class='content'></span><span class='verse v1' data-usfm='JHN.1.1'><span class='label'>" + verses[i].verse + "</span><span class='content'>" + verses[i].text + "</span></span></div>");
				}else{
					$(context.element).append("<div class='p' id=" + book + chapter + "-" + verse + " onclick=\"catchClick('" + book + "'," +chapter+","+verse+")\"><span class='content'></span><span class='verse v1' data-usfm='JHN.1.1'><span class='label'>" + verses[i].verse + "</span><span class='content'>" + verses[i].text + "</span></span></div>");
				}
			}
		},
		/**
		 * Grab bible data from labs.bible.org/api/[passage]
		 * @method  getData
		 * @param  {Function} innerCallback Callback used inside the ajax call which retains context
		 * @param  {Function} outerCallback Callback which is passed the data and correct context
		 * @param  {Object} context       Context of the calling function
		 */
		getData: function(innerCallback, outerCallback, context){
			// Not specifying a callback name since that wont work (reason given above). done() is still returning the data.
			// So this is basically a way to get around Same Origiin problems.
			$.getJSON("http://labs.bible.org/api/?passage=" + context.settings.book + "%20" + context.settings.chapter + "&type=json&callback=?").done(function(args){				
				innerCallback(args, context);
				if(outerCallback) {
					outerCallback(args, context);
				}
			});
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
		// validate: function(book,chapter,verse){

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


	$.fn[name] = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + name)) {
				$.data(this, "plugin_" + name, new Woodworm(this, options));
			}
		});
	};

})(jQuery, window, document);
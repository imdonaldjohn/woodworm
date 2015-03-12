;(function($, window, document, undefined) {

	"use strict";

	if(!$ || !window.jQuery){
		console.error("Woodworm: jQuery not included. Woodworm needs jQuery to do it's thang."); 
	}

	/**
	 * @class  Woodworm
	 * @param {jQuery element} element The element woodworm will build upon.
	 * @param {Object} options Any options passed to overide the defaults.
	 *
	 * @constructor
	 */
	function Woodworm(element, options) {

		/**
		 * Settings surrounding the state of the plugin
		 * @property {Object} settings
		 * @type {Object}
		*/
		this.settings = {
			book: "Genesis",
			chapter: 1,
			verse: 1,
			selectedVerses: [],
			infiniteScroll: false
		};

		/**
		 * Keeps track of the element WW was called on.
		 * @property {Object} element 
		 * @type {Object}
		 */
		this.element = element;


		this.settings = $.extend({}, this.settings, options);
		this.init();     

		return this;
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
		 */
		getChapter: function(book, chapter){
			//Todo: add front-end validation for book, chapter, verse
			this.settings.chapter = chapter ? parseInt(chapter) : this.settings.chapter;
			this.settings.book = book ? book : this.settings.book;
			
			this.getData().done(function(data){
				this.render(data);
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
				var book = verses[i].bookname;
				var chapter = verses[i].chapter;
				var verse = verses[i].verse;
				if(verses[i].title){
					$(this.element).append("<h4>" + verses[i].title + "</h4>");
					$(this.element).append("<div class='p' id=" + book + chapter + "-" + verse + " onclick=\"catchClick('" + book + "'," +chapter+","+verse+")\"><span class='verse v1' data-usfm='JHN.1.1'><span class='label'>" + verses[i].verse + "</span><span class='content'>" + verses[i].text + "</span></span></div>");
				}else{
					$(this.element).append("<div class='p' id=" + book + chapter + "-" + verse + " onclick=\"catchClick('" + book + "'," +chapter+","+verse+")\"><span class='verse' data-usfm='JHN.1.1'><span class='label'>" + verses[i].verse + "</span><span class='content'>" + verses[i].text + "</span></span></div>");
				}
			}
		},
		/**
		 * Grab bible data from labs.bible.org/api/[passage]
		 * @method  getData
		 * @param  {Object} context       Context of the calling function
		 */
		getData: function(){
			var ajax = $.ajax({
				url: "http://labs.bible.org/api/?passage=" + this.settings.book + "%20" + this.settings.chapter + "&type=json&callback=?",
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


	$.fn.Woodworm = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + "Woodworm")) {
				$.data(this, "plugin_" + "Woodworm", new Woodworm(this, options));
			}
		});
	};

})(jQuery, window, document);
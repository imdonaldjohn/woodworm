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
		 * @return {HTMLElement}   Verse HTML
		 */
		render: function(){
			var verseTemplate = Woodworm.Templates['verse'];
			this.element = verseTemplate({verse: this.settings});

			this.bootstrap(this.element);

			return this;
		},
		/**
		 * [bootstrap description]
		 * @param  {[type]} element [description]
		 * @return {[type]}         [description]
		 */
		bootstrap: function(element){
			// debugger
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



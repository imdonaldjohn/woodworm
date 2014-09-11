;(function(window, document) {
	var Woodworm = function(element, options){
		if(typeof(element) == 'string' && $('#' + element).length > 0){
			this.element = element;
			this.options = options;
			this._init(options);
		}else{
			_err("Something's not right with the element you provided:", element)
		}
	}

	if(window.jQuery){
		window.Woodworm = Woodworm;
	}else{
		_err("jQuery not included. Woodworm needs jQuery to do it's thang.");
	}


	Woodworm.prototype = {
		defaults: {
			book: "Genesis",
			chapter: 1
		},
		_init: function(options){
			document.domain = "labs.bible.org";
			var _this = this;
			this.options = extend(options ,this.defaults);
			this.getChapter = _getChapter;
		}
	}


	// Funky fresh extend method
	function extend(b, a) {
	    var prop;
	    if (b === undefined) {
	      return a;
	    }
	    for (prop in a) {
	      if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop) === false) {
	        b[prop] = a[prop];
	      }
	    }
	    return b;
	}


	var _getChapter = function(book, chapter){
		var _book = book ? book : this.book;
		var _chapter = typeof(chapter) == 'number' ? chapter : parseInt(chapter);

		// jsonp
		// var _callback = callback;
		return $.get('http://labs.bible.org/api/?passage=' + book + '%20' + chapter + '&type=json')
			// .done(function(data){

			// })
			// .
	}

	var _err = function(msg){
		console.error(msg);
	}
})(window, document)
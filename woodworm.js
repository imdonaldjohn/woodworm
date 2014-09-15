;(function(window, document) {
	var Woodworm = function(element, options){
		if(typeof(element) == 'string' && $('#' + element).length > 0){
			this.element = $('#' + element);
			this.init(options);
		}else{
			this.err("Something's not right with the element you provided: ", element)
		}
	}

	if(window.jQuery){
		window.Woodworm = Woodworm;
	}else{
		console.error("Woodworm: jQuery not included. Woodworm needs jQuery to do it's thang.");
	}


	Woodworm.prototype = {
		defaults: {
			book: "Genesis",
			chapter: 1
		},
		init: function(options){
			var _this = this;
			this.options = this.extend(options ,this.defaults);
			this.getChapter();
		},
		extend: function(b,a){ 
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
		},
		getChapter: function(book, chapter, callback){
			//Todo: add front-end validation for book, chapter, verse
			if(typeof(book) !== "function"){
				this.options.chapter = chapter ? parseInt(chapter) : this.options.chapter;;
				this.options.book = book ? book : this.options.book;
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
		render: function(verses, context){
			context.element.empty();
			for (var i = 0; i < verses.length; i++) {
				if(verses[i].title){
					context.element.append('<h4>' + verses[i].title + '</h4>');
					context.element.append("<div class='p'><span class='content'></span><span class='verse v1' data-usfm='JHN.1.1'><span class='label'>" + verses[i].verse + "</span><span class='content'>" + verses[i].text + "</span></span></div>");
				}else{
					context.element.append("<div class='p'><span class='content'></span><span class='verse v1' data-usfm='JHN.1.1'><span class='label'>" + verses[i].verse + "</span><span class='content'>" + verses[i].text + "</span></span></div>");
				}
			};
		},
		getData: function(innerCallback, outerCallback, context){
			// Not specifying a callback name since that wont work (reason given above). done() is still returning the data.
			// So this is basically a way to get around Same Origiin problems.
			$.getJSON('http://labs.bible.org/api/?passage=' + context.options.book + '%20' + context.options.chapter + '&type=json&callback=?').done(function(args){				
				innerCallback(args, context);
				if(outerCallback)
					outerCallback(args, context);
			});
		},
		validate: function(book,chapter,verse){

		},
		err: function(msg){
			console.error(msg);
		}
	}
})(window, window.document)
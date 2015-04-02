module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("package.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			options: {
				banner: "<%= meta.banner %>"
			},
			dist: {
				src: ["src/utils.js","src/verse.js","src/woodworm.js","src/templates.js"],
				dest: "dist/woodworm.js"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/woodworm.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/woodworm.js"],
				dest: "dist/woodworm.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// Watch for changes to source
		// watch: {
		// 	files: ['src/*.js','demo/*.html'],
		// 	tasks: ['default'],
		// 	options: {
		// 		reload: true
		// 	}
		// },

		// YUI documentation
		yuidoc: {
			compile: {
				name: '<%= pkg.name %>',
				description: '<%= pkg.description %>',
				version: '<%= pkg.version %>',
				url: '<%= pkg.homepage %>',
				options: {
					paths: 'src/',
					outdir: 'docs/'
				}
			}
		},

		// Connect dev server
		connect: {
			options: {
				port: 9001,
				hostname: 'localhost',
				keepalive: true	
			},
			server: {
				options: {
					base: ['./','./demo/']
				}
			}
		},

		// Compile templates
		jst: {
			compile: {
				options: {
					namespace: "Woodworm.Templates",
					prettify: true,
					processName: function(filename) {
			            return filename.replace(/(src\/templates\/|.html)/g, '');
			        }
				},
				files: {
					"src/templates.js": ["src/templates/**/*.html"]
				}
			}
		}

	});

	grunt.option('force', true);

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	// grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-yuidoc");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks('grunt-contrib-jst');

	grunt.registerTask("build", ["jst", "concat", "uglify"]);
	grunt.registerTask("dev", ["build", "jshint", "yuidoc", "connect"]);
	grunt.registerTask("default", ["jshint", "build", "yuidoc"]);
	grunt.registerTask("travis", ["default"]);

};
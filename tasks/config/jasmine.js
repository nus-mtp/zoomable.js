/**
 * To run jasmine test (Not working currently due to phantomJS not support html5 <video> tag)
 *
 * ---------------------------------------------------------------
 *
 * Minifies css files and places them into .tmp/public/min directory.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-cssmin
 */
module.exports = function(grunt) {

	grunt.config.set('jasmine', {
	    jasmine : {
	      // Your project's source files
	      src : 'player/assets/javascripts/canvasControls.js',
	      options: { 
	      // Your Jasmine spec files
	      	specs : 'tests/spec/player_spec.js'
	      }
	    }
	});

	grunt.loadNpmTasks('grunt-contrib-jasmine');
};

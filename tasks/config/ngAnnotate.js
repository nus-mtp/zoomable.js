/**
 * Add, remove and rebuild AngularJS dependency injection annotations
 *
 * ---------------------------------------------------------------
 *
 * This grunt task is configured to add, remove 
 * and rebuild AngularJS dependency injection annotations.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-ng-annotate
 */
module.exports = function(grunt) {

	grunt.config.set('ngAnnotate', {
		options: {
	        singleQuotes: true
	    },
	    app: {
	    	files: {
	        	'.tmp/public/concat/production.js': '.tmp/public/concat/production.js',
	    	}
	    }
	});

	grunt.loadNpmTasks('grunt-ng-annotate');
};
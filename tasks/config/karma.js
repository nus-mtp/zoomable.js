/**
 * Run karma test cases
 *
 * ---------------------------------------------------------------
 *
 * A grunt task for running frontend unit testing using karma
 *
 * For usage docs see:
 * 		https://github.com/karma-runner/grunt-karma
 */
module.exports = function(grunt) {

	grunt.config.set('karma', {
	  unit: {
			configFile: 'karma.conf.js'
	  }
	});

	grunt.loadNpmTasks('grunt-karma');
};

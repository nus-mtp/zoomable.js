/**
 * Run mocha test cases
 *
 * ---------------------------------------------------------------
 *
 * A grunt task for running server side mocha tests
 *
 * For usage docs see:
 * 		https://github.com/pghalliday/grunt-mocha-test
 */
module.exports = function(grunt) {

	grunt.config.set('mochaTest', {
		test: {
			options: {
				reporter: 'spec'
			},
			src: ['test/bootstrap.test.js', 'test/integration/**/*.test.js']
		}
	});

	grunt.loadNpmTasks('grunt-mocha-test');
};

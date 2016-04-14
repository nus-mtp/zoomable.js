/**
 * Run mocha test cases
 *
 * ---------------------------------------------------------------
 *
 * A grunt task for running server side mocha tests with istanbul coverage
 *
 * For usage docs see:
 * 		https://github.com/pocesar/grunt-mocha-istanbul
 */
module.exports = function(grunt) {

	grunt.config.set('mocha_istanbul', {
		coverage: {
	    src: ['test/bootstrap.test.js', 'test/integration/**/*.test.js'],
	    options: {
	      coverageFolder: 'coverage/server',
	      mask: '**/*.test.js',
				timeout: '5s',
				reportFormats: ['lcov']
	    }
	  }
	});

	grunt.loadNpmTasks('grunt-mocha-istanbul');
};

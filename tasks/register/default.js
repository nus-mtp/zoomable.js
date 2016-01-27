module.exports = function (grunt) {
	/* Disable 'linkAssets' to make sure scripts run correctly without automation */
	grunt.registerTask('default', ['compileAssets', 'linkAssets', 'watch']);

};

module.exports = function (grunt) {
	//grunt.registerTask('default', ['compileAssets', 'linkAssets','watch']);
	/* Disable 'linkAssets' to make sure scripts run correctly without automation */
	grunt.registerTask('default', ['compileAssets', 'watch']);
};

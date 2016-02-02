module.exports = function (grunt) {
	grunt.registerTask('buildProd', [
		'compileAssets',
		'concat',
		'uglify',
		'cssmin',
		'jasmine',
		'linkAssetsBuildProd',
		'clean:build',
		'copy:build'
	]);
};

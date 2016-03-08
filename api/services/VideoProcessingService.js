/**
 * VideoProcessingService
 * 
 * @description :: Server-side logic to automate video processing
 * @help		:: See http://links.sailsjs.org/docs/service
 */

var spawn = require('child_process').spawn;

module.exports = {
	run: function(options) {
		var dirPath = options.param('dir');
		var fileName = sails.getBaseUrl() + '/' + options.param('filename');

		var command = spawn(sails.config.appPath + '/scripts/video-processing.sh', [dirPath]);	

		// ffmpg uses the stderr output
        command.stderr.on('data', function(chunk) {
            console.log('stderr: ' + chunk);
        });

        command.on('close', function(chunk) {
        	for (var i = 0; i < isDoneProcessing.size(); i++) {
        		if (id == isDoneProcessing[i].id) {
        			isDoneProcessing[i].status = true;
        		}
        	}
        	console.log("Complete processing the uploaded video")
        });
	} 
}
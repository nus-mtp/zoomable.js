/**
 * VideoProcessingService
 *
 * @description :: Server-side logic to automate video processing
 * @help        :: See http://links.sailsjs.org/docs/service
 */

// var fs = require('fs');
var spawn = require('child_process').spawn;

module.exports = {

    automateProcessing: function(options) {
        // To get dir, use options.dir
    	dirPath = options.dir;
    	// var videoFile = fs.readdir(dirPath, function(error, listOfVids) {
    	// 	// If an error has occurred
    	// 	if (error) {
    	// 		// Print the error for now, throw an error for a error handler later
    	// 		console.log(error)
    	// 	}
    	// })
        var command = spawn(sails.config.appPath + '/scripts/video-processing.sh', [dirPath]);

        command.stdout.on('data', function(chunk) {
            console.log('stdout: ' + chunk);
        });

        command.stderr.on('data', function(chunk) {
            console.log('stderr: ' + chunk);
            res.send(500); // when script fails, generate a Server Error HTTP res
        });

        command.on('close', function(chunk) {
            res.send("Complete processing the uploaded video!");
        });

    	// console.log(videoFile[0]);
    }
};
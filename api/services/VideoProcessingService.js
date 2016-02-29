/**
 * VideoProcessingService
 *
 * @description :: Server-side logic to automate video processing
 * @help        :: See http://links.sailsjs.org/docs/service
 */

var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');

module.exports = {

    automateProcessing: function(options) {
        // Type your code here
        // To get dir, use options.dir
    	dirPath = options.dir;
    	var videoFile = fs.readdir(dirPath, function(error, listOfVids) {
    		// If an error has occurred
    		if (error) {
    			// Print the error for now, throw an error for a error handler later
    			console.log(error)
    		}
    	})
    	
    	console.log(videoFile[0]);
    }
};
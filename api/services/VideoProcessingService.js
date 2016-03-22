/**
 * VideoProcessingService
 * 
 * @description :: Server-side logic to automate video processing
 * @help		:: See http://links.sailsjs.org/docs/service
 */

var spawn = require('child_process').spawn;

module.exports = {
	run: function(options) {
		var dirPath = options.dir;
		var id = options.id;

		var command = spawn(sails.config.appPath + '/scripts/video-processing.sh', [dirPath]);	

		// ffmpg uses the stderr output
        command.stderr.on('data', function(chunk) {
            console.log('stderr: ' + chunk);
        });

        command.on('close', function(chunk) {
        	for (var i = 0; i < sails.isDoneProcessing.length; i++) {
        		if (id == sails.isDoneProcessing[i].id) {
        			sails.isDoneProcessing[i].status = true;
        		}
        	}

            Video.update({
                id: id,
            }, {
                hasProcessed: 'true'
            }).exec(function(err, video) { 
                if (err) throw err;
                console.log("Complete processing the uploaded video");
            });
        });
	} 
}
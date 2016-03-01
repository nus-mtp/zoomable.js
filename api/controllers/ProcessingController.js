/**
 * ProcessingController
 *
 * @description :: Server-side logic for managing processings
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var spawn = require('child_process').spawn;

module.exports = {

	/**
	 *	Usage: POST /api/processing/run
	 *	Content: {dir: ':dir', filename: ':filename'}
	**/
	run: function (req, res) {
		var dirPath = req.param('dir');
		var fileName = sails.getBaseUrl() + '/' + req.param('filename');

		var command = spawn(sails.config.appPath + '/scripts/video-processing.sh', [dirPath]);

        command.stdout.on('data', function(chunk) {
            console.log('stdout: ' + chunk);
        });

        command.stderr.on('data', function(chunk) {
            console.log('stderr: ' + chunk);
            // res.send(500); // when script fails, generate a Server Error HTTP res
        });

        command.on('close', function(chunk) {
        	// return json contains mpdDir and thumbnailDir
            res.json({
            	mpdDir: [
            		filename+'_mpd_R1C1.mpd', filename+'_mpd_R1C2.mpd', filename+'_mpd_R1C3.mpd', filename+'_mpd_R1C4.mpd',
            		filename+'_mpd_R2C1.mpd', filename+'_mpd_R2C2.mpd', filename+'_mpd_R2C3.mpd', filename+'_mpd_R2C4.mpd',
            		filename+'_mpd_R3C1.mpd', filename+'_mpd_R3C2.mpd', filename+'_mpd_R3C3.mpd', filename+'_mpd_R3C4.mpd',
            		filename+'_mpd_R4C1.mpd', filename+'_mpd_R4C2.mpd', filename+'_mpd_R4C3.mpd', filename+'_mpd_R4C4.mpd'
            	],
            	thumbnailDir: filename + '.png'
            });
        });
	}
};


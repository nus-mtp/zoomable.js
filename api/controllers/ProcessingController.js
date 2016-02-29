/**
 * ProcessingController
 *
 * @description :: Server-side logic for managing processings
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/**
	*	Usage: POST /api/processing/run
	*	Content: {dir: ':dir'}
	**/
	run: function (req, res) {
		console.log(req.param('dir'));
		VideoProcessingService.automateProcessing({dir: req.param('dir')});
	}
};


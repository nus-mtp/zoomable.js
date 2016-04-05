/**
* ViewData.js
*
* @description :: This model represents the data for all the video statistics.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		coordinates: {
			type: 'array',
			required: true
		},

		width: {
			type: 'float',
			required: true
		},

		videoTime: {
			type: 'float',
			required: true
		},

		videoTotalTime: {
			type: 'float',
			required: true
		},

		// Add a reference to ViewSession
		sessionObj: {
			model: 'ViewSession'
		}
	}
}

// Tag.js
// The set of tags registered in our app.

module.exports = {
	attributes: {
		name: {
			type: 'string',
			required: true,
			unique: true
		},	

		videoWithTags: {
			collection:'video',
			via: 'tags'
		}
	}
}
// Tag.js
// The set of tags registered in our app.

module.exports = {
	attributes: {
		name: {
			type: 'string',
			required: true,
			primaryKey: true
		},	

		videoWithTags: {
			collection:'video',
			via: 'tags'
		}
	}
}
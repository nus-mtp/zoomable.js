// Video.js
// The set of videos registered in our app.

module.exports = {
	attributes: {
		videoId: {
			type: 'integer',
			unique: true,
			primaryKey: true,
			required: true
		},

		title: {
			type: 'string',
			required: true
		},

	    description: {
	    	type: 'string'
	    },

	    tags: {
	    	collection: 'tag',
	    	via: 'videoWithTags'
	    },

	    // 0 for self only, 1 for public
	    privacy: {
	    	type: 'integer', 
	    	required: true,
	    	defaultsTo: 1
	    },

	    duration: {
	    	type: 'string'
	    },

	    shares: {
	    	type: 'integer',
	    	defaultsTo: 0
	    },
	    
	    createdAt: {
	    	type: 'datetime',
	    	defaultsTo: function() {return new Date(); }
	    },

	    updateAt: {
	    	type: 'datetime',
	    	defaultsTo: function() {return new Date(); }
	    }
	}
}
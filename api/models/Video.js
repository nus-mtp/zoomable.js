// Video.js
// The set of videos registered in our app.

module.exports = {
	autoPK: false,
	attributes: {
		id :{
			autoIncrement: true,
			primaryKey: true,
			columnName: 'video_id'
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

	    views: {
	    	type: 'integer',
	    	defaultsTo: 0
	    },

	    // 0 for self only, 1 for public
	    privacy: {
	    	type: 'integer', 
	    	defaultsTo: 1
	    },

	    duration: {
	    	type: 'string'
	    },

	    shares: {
	    	type: 'integer',
	    	defaultsTo: 0
	    },

	    videoDir: {
	    	type: 'string'
	    },

	    mpdDir: {
	    	type: 'array'
	    },

	    thumbnailDir: {
	    	type: 'string'
	    },

	    hasProcessed: {
	    	type: 'string',
	    	enum: ['false', 'true'],
	    	defaultsTo: 'false'
	    },
	    
	    createdAt: {
	    	type: 'datetime',
	    	defaultsTo: function() {return new Date(); }
	    },

	    updatedAt: {
	    	type: 'datetime',
	    	defaultsTo: function() {return new Date(); }
	    }
	}
}
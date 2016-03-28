/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		username: {
			type: 'string',
			required: true,
			unique: true,
		},	

		encryptedPassword: {
			type: 'string',
			required: true,
			minLength: 6,
			columnName: 'encrypted_password'
		},

		lastLoggedIn: {
			type: 'datetime',
			defaultsTo: function() {return new Date(); }
		},

		email: {
			type: 'string',
			email: true,
			required: true,
			unique: true
		},

		permission: {
			type: 'string',
			enum: ['admin', 'normal'],
			defaultsTo: 'normal'
		},

		// each user owns multiple videos
		videos: {
			collection: 'video',
			via: 'ownedBy'
		}
	},
}

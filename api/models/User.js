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
			unique: true
		},	

		encryptedPassword: {
			type: 'string',
			required: true,
			minLength: 6,
			columnName: 'encrypted_password'
		},

		// 0 for admin, 1 for normal user
		permission: {
			type: 'integer',
			defaultTo: 1,
			required: true
		}
	},
}

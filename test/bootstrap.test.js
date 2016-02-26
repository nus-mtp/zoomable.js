var Sails = require('sails');
var Barrels = require('barrels');
var should = require('should');

before(function(done) {
	// Increase the Mocha timeout so that Sails has enough time to lift.
	this.timeout(5000);

	Sails.lift({
		// Configuration for testing purpose
		log: {
			level: 'error'
		},
		models: {
			connection: 'test',
			migrate: 'drop'
		}
	}, function (err, server) {
		if (err) return done(err);
		
		// here you can load fixtures, etc.
		// load fixtures
		var barrels = new Barrels();

		// Save originals objects in 'fixtures' variable
		fixtures = barrels.data;

		// Populate DB
		barrels.populate(function (err) {
			done(err, sails);
		});
	});
});

after(function(done) {
	console.log();
	// here you can clear fixtures, etc.
	sails.lower(done);
});
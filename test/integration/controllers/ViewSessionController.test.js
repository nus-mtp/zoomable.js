var request = require('supertest');

describe('ViewSessionController', function () {
	var credentials = { username: 'testuser', password: 'testtesttest'};
	var video = {title: 'Mission Impossible', videoDir: '/video/1', thumbnailDir: '/video/1/a.jpg'};
	var incompleteSession = {sessionId: 'session_id'};
	var session = {sessionId: 'session_id', videoId: 9999, coordinates: [0, 0], width: 99.99, videoTime: 2.55, videoTotalTime: 9.99};
	var video_id = 0;

	before(function(done) {
		// Runs before all tests in this block
		var agent = request.agent('http://localhost:1337');

		// Log in and create a video, assumes no errors to handle
		agent
		.post('/api/user/login')
		.send(credentials)
		.expect(200)
		.end(function (signinErr, signinRes) {
			// Handle Signin Error
			if (signinErr) done(signinErr);

			agent
			.post('/api/video')
			.send(video).set('Accept', 'application/json')
			.expect(200).end(function (videoCreateErr, videoCreateRes) {
				if (videoCreateErr)  done(videoCreateErr);

				// retrive id of created video
				video_id = videoCreateRes.body.id;
				done();
			});
		});
	});

	describe('#create', function () {
		var agent = request.agent('http://localhost:1337');

		it('should not create a new View Session if there are missing fields', function (done) {
			agent
			.post('/api/viewsession')
			.send(incompleteSession)
			.expect(200)
			.end(function (err, res) {
				if (err) done(err);

				res.body.should.be.instanceof(Object);
				res.body.should.have.property('error', 'Required fields are not entered.');
				done();
			});
		});

		it('should not create a new View Session if video id is not found', function (done) {
			// session has invalid video id of 9999
			agent
			.post('/api/viewsession')
			.send(session)
			.expect(404)
			.end(function (err, res) {
				if (err) done(err);

				(res.text).should.match('VideoNotFound');
				done();
			});
		});

		it('should create a new View Session if video id is found', function (done) {
			// set video id in session to be id of created video
			session.videoId = video_id;
			agent
			.post('/api/viewsession')
			.send(session)
			.expect(200)
			.end(function (postErr, postRes) {
				if (postErr)  done(postErr);

				// res body will return the view data object
				postRes.body.should.be.instanceof(Object);
				postRes.body.should.have.property('coordinates').with.lengthOf(2);
				postRes.body.should.have.property('width', 99.99);
				postRes.body.should.have.property('videoTime', 2.55);
				postRes.body.should.have.property('videoTotalTime', 9.99);

				// retrieve the view session to see if it is successfully created
				agent
				.get('/api/viewsession')
				.send(session)
				.expect(200)
				.end(function (getErr, getRes) {
					if (getErr)  done(getErr);

					// a view session object should be created with the correct properties
					getRes.body.should.be.instanceof(Array).and.have.length(1);
					getRes.body[0].should.be.instanceof(Object);
					getRes.body[0].should.have.property('sessionId', 'session_id');
					getRes.body[0].should.have.property('viewLogs').with.lengthOf(1);
					getRes.body[0].should.have.property('videoId').which.should.be.instanceof(Object);
					getRes.body[0].videoId.should.have.property('id', video_id);
					done();
				});
			});
		});
	});
});

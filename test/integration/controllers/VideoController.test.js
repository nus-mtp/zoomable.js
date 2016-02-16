var request = require('supertest');

describe('VideoController', function () {
	var credentials = { username: 'test', password: 'testtesttest'};
	var agent = request.agent('http://localhost:1337');

	describe('#create', function () {
		it('should not create a new Video object before login', function (done) {
			request(sails.hooks.http.app)
			.post('/api/video')
			.send({ title: 'Mission Impossible', videoDir: '/video/1', thumbnailDir: '/video/1/a.jpg'})
			.expect(403)
			.end(function (err, res) {
				if (err) done(err);
				
				(res.text).should.match('You are not permitted to perform this action.');
				done();
			});
		});

		it('should create a new Video object after login', function (done) {
			agent
			.post('/api/user/login')
			.send(credentials)
			.expect(200)
			.end(function (signinErr, signinRes) {
				// Handle Signin Error
				if (signinErr) done(signinErr);

				agent
				.post('/api/video')
				.send({ title: 'Mission Impossible', videoDir: '/video/1', thumbnailDir: '/video/1/a.jpg'})
				.set('Accept', 'application/json')
				.expect(200)
				.end(function (videoCreateErr, videoCreateRes) {
					if (videoCreateErr)  done(videoCreateErr);
					
					(videoCreateRes.body.title).should.equal('Mission Impossible');
					done();
				});
			});
		});
	});

	describe('#read', function () {
		it('should return a Video object based on the id given after login', function (done) {
			agent
			.get('/api/video/1')
			.set('Accept', 'application/json')
			.expect(200)
			.end(function (videoCreateErr, videoCreateRes) {
				if (videoCreateErr)  done(videoCreateErr);
					
				(videoCreateRes.body.title).should.equal('Mission Impossible');
				done();
			});
		});
	});

	describe('#readAll', function () {
		it('should return a list of all Video object after login', function (done) {
			agent
			.get('/api/video')
			.set('Accept', 'application/json')
			.expect(200, done);
		});
	});

	describe('#destroy', function () {
		it('should destroy the Video object based on the id given after login', function (done) {
			agent
			.delete('/api/video/1')
			.end(function (videoDeleteErr, videoDeleteRes) {
				if (videoDeleteErr) done (videoDeleteErr);
				
				agent
				.get('/api/video/1')
				.expect(404, done);
			});
		});
	});
});
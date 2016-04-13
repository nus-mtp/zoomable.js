var request = require('supertest');

describe('VideoController', function () {
	var credentials = { username: 'testuser', password: 'testtesttest'};
	var vid1 = {title: 'Mission Impossible', thumbnailDir: '/video/1/a.jpg'};
	var vid2 = {title: 'Mission Possible', thumbnailDir: '/video/1/a.jpg'};

	describe('#create', function () {
		var agent = request.agent('http://localhost:1337');

		it('should not create a new Video object before login', function (done) {
			request(sails.hooks.http.app)
			.post('/api/video')
			.send(vid1)
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
				.send(vid1)
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
		var agent = request.agent('http://localhost:1337');

		it('should not read Video object based on the id before login', function (done) {
			request(sails.hooks.http.app)
			.get('/api/video/4')
			.expect(403)
			.end(function (err, res) {
				if (err) done(err);

				(res.text).should.match('You are not permitted to perform this action.');
				done();
			});
		});

		it('should return a Video object based on the id given after login', function (done) {
			agent
			.post('/api/user/login')
			.send(credentials)
			.expect(200)
			.end(function (signinErr, signinRes) {
				agent
				.get('/api/video/4')
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

	describe('#readAll', function () {
		var agent = request.agent('http://localhost:1337');

		it('should not read list of all Video object before login', function (done) {
			request(sails.hooks.http.app)
			.get('/api/video/')
			.expect(403)
			.end(function (err, res) {
				if (err) done(err);

				(res.text).should.match('You are not permitted to perform this action.');
				done();
			});
		});

		it('should return a list of all Video object after login', function (done) {
			agent
			.post('/api/user/login')
			.send(credentials)
			.expect(200)
			.end(function (signinErr, signinRes) {
				agent
				.get('/api/video')
				.set('Accept', 'application/json')
				.expect(200)
				.end(function (err, res) {
					if (err) done(err);

					res.body.should.be.instanceof(Array).and.have.length(4);
					res.body[0].should.be.instanceof(Object).and.have.property('title', 'Finding Nemo');
					res.body[1].should.be.instanceof(Object).and.have.property('title', 'Zootopia');
					res.body[2].should.be.instanceof(Object).and.have.property('title', 'The Big Short');
					res.body[3].should.be.instanceof(Object).and.have.property('title', 'Mission Impossible');
					done();
				});
			});
		});
	});

	describe('#update', function () {
		var agent = request.agent('http://localhost:1337');

		it('should not read update Video object based on the id given before login', function (done) {
			request(sails.hooks.http.app)
			.put('/api/video/4')
			.send(vid2)
			.expect(403)
			.end(function (err, res) {
				if (err) done(err);

				(res.text).should.match('You are not permitted to perform this action.');
				done();
			});
		});

		it('should update Video object based on the id given after login', function (done) {
			agent
			.post('/api/user/login')
			.send(credentials)
			.expect(200)
			.end(function (err, res) {
				agent
				.put('/api/video/4')
				.send(vid2)
				.set('Accept', 'application/json')
				.expect(200)
				.end(function (err, res) {
					if (err) done(err);

					res.body[0].should.be.instanceof(Object).and.have.property('title', 'Mission Possible');
					done();
				});
			});
		});
	});

	describe('#destroy', function () {
		var agent = request.agent('http://localhost:1337');

		it('should not read delete Video object based on the id given before login', function (done) {
			request(sails.hooks.http.app)
			.delete('/api/video/4')
			.expect(403)
			.end(function (err, res) {
				if (err) done(err);

				(res.text).should.match('You are not permitted to perform this action.');
				done();
			});
		});

		it('should destroy the Video object based on the id given after login', function (done) {
			agent
			.post('/api/user/login')
			.send(credentials)
			.expect(200)
			.end(function (err, res) {
				agent
				.delete('/api/video/4')
				.end(function (videoDeleteErr, videoDeleteRes) {
					if (videoDeleteErr) done(videoDeleteErr);

					videoDeleteRes.body[0].should.be.instanceof(Object).and.have.property('title', 'Mission Possible');
					// Try to find the deleted video
					agent
					.get('/api/video/4')
					.expect(200)
					.end(function (err, res) {
						if (err) done(err);

						// empty array should be returned if video not found
						res.body.should.be.instanceof(Array).and.have.length(0);
						done();
					});
				});
			});
		});
	});

	describe('#destroyAll', function () {
		var agent = request.agent('http://localhost:1337');

		it('should not read delete Video object based on the id given before login', function (done) {
			request(sails.hooks.http.app)
			.delete('/api/video/')
			.send({'id': ['2','3']})
			.expect(403)
			.end(function (err, res) {
				if (err) done(err);

				(res.text).should.match('You are not permitted to perform this action.');
				done();
			});
		});

		it('should destroy the Video object based on the id given after login', function (done) {
			agent
			.post('/api/user/login')
			.send(credentials)
			.expect(200)
			.end(function (err, res) {
				agent
				.delete('/api/video/')
				.send({'id': ['2','3']})
				.end(function (videoDeleteErr, videoDeleteRes) {
					if (videoDeleteErr) done(videoDeleteErr);

					videoDeleteRes.body.should.be.instanceof(Array).and.have.length(2);
					videoDeleteRes.body[0].should.be.instanceof(Object).and.have.property('title', 'Zootopia');
					videoDeleteRes.body[1].should.be.instanceof(Object).and.have.property('title', 'The Big Short');

					// Try to find deleted video 2
					agent
					.get('/api/video/2')
					.expect(200)
					.end(function (video2CheckErr, video2CheckRes) {
						if (video2CheckErr) done(video2CheckErr);

						// empty array should be returned if video not found
						video2CheckRes.body.should.be.instanceof(Array).and.have.length(0);

						// try to find deleted video 3
						agent
						.get('/api/video/3')
						.expect(200)
						.end(function (video3CheckErr, video3CheckRes) {
							if (video3CheckErr) done(video3CheckErr);

							// empty array should be returned if video not found
							video3CheckRes.body.should.be.instanceof(Array).and.have.length(0);
							done();
						});
					});
				});
			});
		});
	});
});

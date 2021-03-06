var request = require('supertest');

describe('UserController', function () {
	var credentials = { username: 'user123', password: 'testtesttest', email: 'user123@test.com'};
	var existingEmailCredentials = { username: 'user999', password: 'password', email: 'test@test.com'};
	var existingUsernameCredentials = { username: 'testuser', password: 'password', email: 'haha@test.com'};
	var shortUsernameCredentials = { username: 'user', password: 'password', email: 'haha@test.com'};
	var shortPasswordCredentials = { username: 'user999', password: 'pw', email: 'haha@test.com'};
	var vid1 = {title: 'Mission Impossible', thumbnailDir: '/video/1/a.jpg'};
	var vid2 = {title: 'Mission Possible', thumbnailDir: '/video/1/a.jpg'};

	describe('#signup', function () {
		var agent = request.agent('http://localhost:1337');

		it('should be able to signup for a new account', function (done) {
			request(sails.hooks.http.app)
			.post('/api/user/signup')
			.send(credentials)
			.expect(200, done);
		});

		it('should not able to signup for a new account using used email address', function (done) {
			request(sails.hooks.http.app)
			.post('/api/user/signup')
			.send(existingEmailCredentials)
			.expect(409, done);
		});

		it('should not able to signup for a new account using used username', function (done) {
			request(sails.hooks.http.app)
			.post('/api/user/signup')
			.send(existingUsernameCredentials)
			.expect(400, done);
		});

		it('should not able to signup for a new account if username is less than 6 characters', function (done) {
			request(sails.hooks.http.app)
			.post('/api/user/signup')
			.send(shortUsernameCredentials)
			.expect(400, done);
		});

		it('should not able to signup for a new account if password is less than 6 characters', function (done) {
			request(sails.hooks.http.app)
			.post('/api/user/signup')
			.send(shortUsernameCredentials)
			.expect(400, done);
		});
	});

	describe('#login', function () {
		var agent = request.agent('http://localhost:1337');

		it('should be able to login with correct credentials', function (done) {
			request(sails.hooks.http.app)
			.post('/api/user/login')
			.send(credentials)
			.expect(200, done);
		});

		it('should not be able to login with wrong credentials', function (done) {
			request(sails.hooks.http.app)
			.post('/api/user/login')
			.send(existingEmailCredentials)
			.expect(401, done);
		});
	});

	describe('#logout', function () {
		var agent = request.agent('http://localhost:1337');

		it('should be able to logout after signed in', function (done) {
			agent
			.post('/api/user/login')
			.send(credentials)
			.expect(200)
			.end(function (err, res) {
				if (err) done(err);

				agent
				.get('/api/user/logout')
				.expect(200, done);
			});
		});

		it('should be able to logout if not signed in', function (done) {
			agent
			.get('/api/user/logout')
			.expect(200, done);
		});
	});
});

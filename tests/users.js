const app = require('../bin/www'),
	  superagent = require('superagent'),
	  expect = require('expect.js');

describe('Users module', function(){

	before(function(){
		app.boot();
	})

	describe('authorize and authenticate', function(){

		it('should forbid to access the page', function(done){
			superagent
				.get('http://localhost' + '/users/admin')
				.end(function(err, res){
					expect(res.status).to.equal(401);
					done();
				});
		})

		var authorizedUser = superagent.agent();

		it('should login successfully by email and password', function(done){
			authorizedUser
				.post('http://localhost' + + '/users/login')
				.send({ email: 'feimei.zhan@live.com', password: '123456'})
				.end(function(err, res){
					expect(res.status).to.equal(200);
					expect(res.redirects.length).to.equal(1);
					done();
				});					
		})

		it('should access the admin page', function(done){
			authorizedUser
				.get('http://localhost' + '/users/admin')
				.end(function(err, res){
					expect(res.status).to.equal(200);
					done();
				});
		})

	})


	after(function(){
		app.shutdown();
	})


})

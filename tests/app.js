var app = require('../bin/debug'),
	superagent = require('superagent'),
	expect = require('expect.js');

describe('server', function(){

	before(function(){
		app.boot();
	});

	describe('homepage', function(){
		it('should listen successfully', function(done){
			superagent
				.get('http://localhost:' + app.port)
				.end(function(err, res){
					expect(res.status).to.equal(200);
					done();
				});
		});
	});

	after(function(){
		app.shutdown();
	});
	
});

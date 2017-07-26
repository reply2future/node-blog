const app = require('../bin/debug'),
	  superagent = require('superagent'),
	  expect = require('expect.js');

const seedArticles = require('../db/articles.json');

describe('server', function(){

	before(function(){
		app.boot();
	})

	describe('homepage', function(){
		it('should listen successfully', function(done){
			superagent
				.get('http://localhost:' + app.port)
				.end(function(err, res){
					expect(res.status).to.equal(200);
					done();
				});
		});

		it('should contain posts', function(done){
			superagent
				.get('http://localhost:' + app.port)
				.end(function(err, res){
					seedArticles.forEach(function(item, index, list){
						if(item.published){
							expect(res.text).to.contain('<h2><a href="/article/' + item.slug + '">' + item.title);
						} else {
							expect(res.text).not.to.contain('<h2><a href="/article/' + item.slug + '">' + item.title);
						}
					});

					done();
				});

		});
	})

	describe('article page', function(){
		it('should display text', function(done){
			let n = seedArticles.length;
			seedArticles.forEach(function(item, index, list){
				superagent
					.get('http://localhost:' + app.port + '/article/' + seedArticles[index].slug)
					.end(function(err, res){
						if(item.published){
							expect(res.text).to.contain(seedArticles[index].text);
						}else{
							expect(res.status).to.be(401);
						}

						if(index + 1 === n){
							done();
						}

					});
			});
		});

		after(function(){
			app.shutdown();
		});

	})
})

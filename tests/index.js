const app = require('../bin/www'),
	  superagent = require('superagent'),
	  expect = require('expect.js');

describe('server', function(){

	var articles;

	before(function(){
		app.boot();
	})

	describe('articles data fetch', function(){
		it('should get all articles successfully', function(done){
			superagent
				.get('http://localhost' + '/api/articles')
				.end(function(err, res){
					expect(res.status).to.equal(200);
					articles = res.body.message;
					done();
				});
		})
	})

	describe('homepage', function(){
		it('should listen successfully', function(done){
			superagent
				.get('http://localhost')
				.end(function(err, res){
					expect(res.status).to.equal(200);
					done();
				});
		});

		it('should contain posts', function(done){
			superagent
				.get('http://localhost')
				.end(function(err, res){
					articles.forEach(function(item, index, list){
						if(item.published){
							expect(res.text).to.contain(item.title);
						} else {
							expect(res.text).not.to.contain(item.title);
						}
					});

					done();
				});

		});
	})

	describe('article page', function(){
		it('should display text', function(done){
			let n = articles.length;
			articles.forEach(function(item, index, list){
				superagent
					.get('http://localhost' + '/articles/' + articles[index].slug)
					.end(function(err, res){
						if(item.published){
							expect(res.text).to.contain(articles[index].title);
						}else{
							expect(res.status).to.be(404);
						}

						if(index + 1 === n){
							done();
						}

					});
			});
		});
	})
	
	after(function(){
		app.shutdown();
	})
})

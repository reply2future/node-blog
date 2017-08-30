
const app = require('../bin/www'),
	  superagent = require('superagent'),
	  expect = require('expect.js');

const seedArticles = require('../db/articles.json');

describe('server', function(){

	var authorizedUser = superagent.agent();

	var postData = {
		article: {
			_id: "18b28be4f366d000689806a",
			title: "test-article-title",
			slug: "test-article-slug",
			tags: [
				"test",
				"article"
			],
			text: {
				ops: [
				{
					insert: "test"
				},
				{
					attributes: {
						"link": "https://nodejs.org/en/docs/guides/nodejs-docker-webapp/"
					},
					insert: "文档"
				},
				{
					insert: ",由于需求略作改动后，发现会因为无法找到node_modules的各项依赖而报错。\n\n"
				},
				{
					insert: "供参考。\n"
				}
				]
			},
		}
	}
	before(function(){
		app.boot();
	})

	describe('article module', function(){
		it('should login successfully', function(done){
			authorizedUser
				.post('http://localhost:' + app.port + '/users/login')
				.send({ email: 'feimei.zhan@live.com', password: '123456'})
				.end(function(err, res){
					expect(res.status).to.equal(200);
					expect(res.redirects.length).to.equal(1);
					done();
				});
		})

		it('should post successfully', function(done){
			authorizedUser
				.post('http://localhost:' + app.port + '/api/articles')
				.send(JSON.stringify(postData))
				.set('Content-Type', 'application/json')
				.end(function(err, res){
					expect(res.status).to.equal(201);
					done();
				});
		})

		it('should modify successfully', function(done){
			postData.article.title = 'Modified',
			authorizedUser
				.put('http://localhost:' + app.port + '/api/articles/' + postData.article._id)
				.send(postData)
				.end(function(err, res){
					expect(res.status).to.equal(200);
					expect(res.body.message.nModified).to.equal(1);
					done();
				});
		})

		it('should delete successfully', function(done){
			authorizedUser
				.delete('http://localhost:' + app.port + '/api/articles/' + postData.article._id)
				.end(function(err, res){
					expect(res.status).to.equal(200);
					expect(res.body.message).to.equal(1);
					done();
				});	
		})
	})	

	after(function(){
		app.shutdown();
	})
})

const app = require('../bin/www'),
	  superagent = require('superagent'),
	  expect = require('expect.js');
	  lowdb = require('lowdb'),
	  FileSync = require('lowdb/adapters/FileSync'),
	  dataAdapter = new FileSync('./db/data.json'),
	  db = lowdb(dataAdapter),
	  lodashId = require('lodash-id'),
	  crypto = require('crypto');

describe('api module', function(){
	let testUser = {
		email: 'test@gmail.com',
		password: '123456',
		isAdmin: true
	};
	let postData = {
		article: {
			id: "18b28be4f366d000689806a",
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
	let authorizedUser = superagent.agent();

	before(function(){
		db._.mixin(lodashId);
		db.defaults({ articles:[], users:[] }).write();
		// add test user
		db.get('users').insert({
			email: testUser.email, 
			password: crypto.createHash('md5').update(testUser.password).digest('hex'),
			isAdmin: testUser.isAdmin
		}).write();
		app.boot();
	})

	describe('authorize and authenticate', function(){

		it('should forbid to access the page', function(done){
			superagent
				.get('http://localhost:' + app.port + '/users/admin')
				.end(function(err, res){
					expect(res.status).to.equal(401);
					done();
				});
		})

		it('should login successfully by email and password', function(done){
			authorizedUser
				.post('http://localhost:' + app.port + '/users/login')
				.send(testUser)
				.end(function(err, res){
					expect(res.status).to.equal(200);
					expect(res.redirects.length).to.equal(1);
					done();
				});					
		})

		it('should access the admin page', function(done){
			authorizedUser
				.get('http://localhost:' + app.port + '/users/admin')
				.end(function(err, res){
					expect(res.status).to.equal(200);
					done();
				});
		});

		it('should post successfully', function(done){
			authorizedUser
				.post('http://localhost:' + app.port + '/api/articles')
				.send(JSON.stringify(postData))
				.set('Content-Type', 'application/json')
				.end(function(err, res){
					expect(res.status).to.equal(201);
					done();
				});
		});

		it('should modify successfully', function(done){
			postData.article.title = 'Modified',
			authorizedUser
				.put('http://localhost:' + app.port + '/api/articles/' + postData.article.id)
				.send(postData)
				.end(function(err, res){
					expect(res.status).to.equal(200);
					done();
				});
		});

		it('should get all articles successfully', function(done){
			superagent
				.get('http://localhost:' + app.port + '/api/articles')
				.end(function(err, res){
					expect(res.status).to.equal(200);
					articles = res.body.message;
					console.log(`fetch ${articles ? articles.length : 0} size of articles`);
					done();
				});
		})

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


		it('should delete successfully', function(done){
			authorizedUser
				.delete('http://localhost:' + app.port + '/api/articles/' + postData.article.id)
				.end(function(err, res){
					expect(res.status).to.equal(200);
					done();
				});	
		});

	})


	after(function(){
		db.get('users').removeWhere({email: testUser.email}).write();
		app.shutdown();
	})
})

const http = require('http');

const server = http.createServer(function(req, res){
	res.statusCode = 200;
	res.end('');
});

server.listen(8888, '127.0.0.1', ()=> {
	console.log('empty daemon of node-blog-debug');	
});

# Node Blog
A blog use Node.js,Mongodb,nginx and deployed with docker.

# Feature note

## Node.js

Dealing with request and response.

## Mongodb

Store users info and articles.

## Nginx

As reverse proxy server and web server.

## Docker

Isolate each part.

# Build

**IMPORT**

you need create a new file named **MakefileConfig.json** in the project root directory.Such as mongodb password.for example:

```
{
	"twitterKey": "",
	"twitterSecret" : "",
	"cookieSecret" : "",
	"sessionSecret" : "",
	"mongoAdmin" : "",
	"mongoAdminPwd" : "",
	"mongoBlogUser" : "",
	"mongoBlogPwd" : ""
}
```

All build step is in the **Makefile** file,you just need to run `make one-click-deploy` in the project root directory and wait a minutes.

All done!Check http://localhost

# Config

## Disqus comment plugin

**IMPORTANT:** use your own **embed.js** url to replace mine in the *views/article.pug*

```
s.src = 'https://reply2future-pw.disqus.com/embed.js';
```

# Demo
[My Blog](http://reply2future.pw)

## Reference
1.[Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

2.[Manage data in containers](https://docs.docker.com/engine/tutorials/dockervolumes/)

3.[Mongodb how to enable auth](https://docs.mongodb.com/manual/tutorial/enable-authentication/)

4.[Docker mongo how to authentication and authorization](https://hub.docker.com/_/mongo/)

5.[Write Scripts for the mongo Shell](https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/)

6.[Nginx Full Example Configuration](https://www.nginx.com/resources/wiki/start/topics/examples/full/)

7.[Nginx beginner's Guide](http://nginx.org/en/docs/beginners_guide.html)

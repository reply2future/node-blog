# Node Blog

[![Build Status](https://travis-ci.org/feimeizhan/node-blog.svg?branch=simplify)](https://travis-ci.org/feimeizhan/node-blog)
[![Coverage Status](https://coveralls.io/repos/github/feimeizhan/node-blog/badge.svg?branch=simplify)](https://coveralls.io/github/feimeizhan/node-blog?branch=simplify)

A blog use Node.js,[lowdb](https://github.com/typicode/lowdb) and deployed with docker.Occupies less resources and simple.

## System requirement
- docker 
  - docker>=17.0-ce
  - docker-compose>=1.6
- Node.js
  - node>=6
  - npm>=3
- make

## Usage

### Configuration
- You need create a new file named **docker-compose.env** in the project root directory.Such as node expose port.for example:
```bash
TWITTER_KEY=xxxxx
TWITTER_SECRET=xxxx
COOKIE_SECRET=xxxxx
SESSION_SECRET=xxxxx
...
```
- Use your Disqus comment plugin
**IMPORTANT:** use your own **embed.js** url to replace mine in the *views/article.pug*
```javascript
s.src = 'https://reply2future-pw.disqus.com/embed.js';
```
- Create your **db** directory to store your data,and see **docker-compose.yml** [volumes](https://docs.docker.com/engine/reference/builder/#volume) settings.
### Test 
All test step is in the **Makefile** file,you just need to run `make one-click-test` in the project root directory and wait a few seconds,and it will show you the report of test.

### Deployed
```docker
docker-compose up -d
```
All done!Check http://localhost:3000
# Demo
[My Blog](http://reply2future.pw:3000)

## Reference
1.[Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

2.[Manage data in containers](https://docs.docker.com/engine/tutorials/dockervolumes/)

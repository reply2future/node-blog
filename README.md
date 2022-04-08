# Node Blog

[![Build Status](https://app.travis-ci.com/reply2future/node-blog.svg?branch=master)](https://app.travis-ci.com/github/reply2future/node-blog)
[![Coverage Status](https://coveralls.io/repos/github/feimeizhan/node-blog/badge.svg?branch=master)](https://coveralls.io/github/feimeizhan/node-blog?branch=master)

A blog use Node.js,[lowdb](https://github.com/typicode/lowdb) and deployed with docker.Occupies less resources and simple.

## System requirement

- docker
  - docker>=17.0-ce
  - docker-compose>=1.6
- Node.js
  - node>=16
  - npm>=8

## Usage

There are two ways to deploy the service. If you want to deploy automatically, you could refer to [my CI/CD](.github/workflows/docker-image.yml)

### npm command(first way)

#### Configuration

```text
ADMIN_USER:                         // the username to login the blog administrator beckend
ADMIN_PWD:                          // the password to login the blog, use the `MD5` string
COOKIE_SECRET: 
SESSION_SECRET: 
MAIL_HOST:                          // error mail host
MAIL_USER:                          // error mail user
MAIL_PASS:                          // error mail password
MAIL_FROM:                          // error mail from
MAIL_TO:                            // error mail to notify `receiver`
```

#### Steps

1. Set the environment variable
2. Run below command on the root of project.

> npm start

All done!Check <http://localhost:3000>

----

### docker-compose(second-way)

#### Configuration

```text
ADMIN_USER:                         // the username to login the blog administrator beckend
ADMIN_PWD:                          // the password to login the blog, use the `MD5` string
COOKIE_SECRET: 
SESSION_SECRET: 
MAIL_HOST:                          // error mail host
MAIL_USER:                          // error mail user
MAIL_PASS:                          // error mail password
MAIL_FROM:                          // error mail from
MAIL_TO:                            // error mail to notify `receiver`
IMAGE_NAME                          // the project image name, for examples `feimeizhan/node-blog:c6b5ab59532b5e98ea1860fd8bb618f33f57302a`
DB_PATH:                            // the db location
```

#### Steps

1. Rename the file `docker-compose.yml.template` to `docker-compose.yml`
2. Build your image and push it to the image registry, and you could refer to the command `npm run build-img:linux` of `package.json`.
3. Replace the environment variable of `docker-compose.yml`, such as `${ADMIN_USER}`, and you could use `envsubst` command to do it quckily.
4. Run below command on the same directory of the `docker-compose.yml`.

> docker-compose up -d

All done!Check <http://localhost:3000>

### Configuration

- Use your Disqus comment plugin
**IMPORTANT:** use your own **embed.js** url to replace mine in the *views/article.pug*

```javascript
s.src = 'https://reply2future-pw.disqus.com/embed.js';
```

- Create your **db** directory to store your data,and see **docker-compose.yml** [volumes](https://docs.docker.com/engine/reference/builder/#volume) settings.

## Test

> npm test

## Demo

[My Blog](http://blog.reply2future.pw)

## Reference

1.[Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

2.[Manage data in containers](https://docs.docker.com/engine/tutorials/dockervolumes/)

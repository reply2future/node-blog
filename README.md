# Node Blog

[![Build Status](https://app.travis-ci.com/reply2future/node-blog.svg?branch=master)](https://app.travis-ci.com/github/reply2future/node-blog)
[![Coverage Status](https://coveralls.io/repos/github/feimeizhan/node-blog/badge.svg?branch=master)](https://coveralls.io/github/feimeizhan/node-blog?branch=master)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

A blog use Node.js,[lowdb](https://github.com/typicode/lowdb) and deployed with docker.Occupies less resources and simple.

## System requirement

- docker
  - docker>=17.0-ce
  - docker-compose>=1.6
- Node.js
  - node>=16
  - npm>=8

## Usage

If you want to deploy automatically, you could refer to [my CI/CD](.github/workflows/docker-image.yml)

### Configuration

Using the environment variables to configure the service.

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
GOOGLE_ANALYTICS:                   // use google analytics or not, boolean type, default `false`
GOOGLE_ANALYTICS_ID:                // if use google analytics, set the gid, such as `UA-152095536-1`
DISQUS:                             // use disqus comment or not, boolean type, default `false`
DISQUS_NAME:                        // if use disqus comment, set the name, such as `reply2future-pw`
```

### Launch

There are two ways to deploy the service: `npm command` and `docker-compose`.

#### npm command

1. Set the environment variable
2. Run below command on the root of project.

> npm start

#### docker-compose

1. Rename the file `docker-compose.yml.template` to `docker-compose.yml`
2. Build your image and push it to the image registry, and you could refer to the command `npm run build-img:linux` of `package.json`.
3. Replace the environment variable of `docker-compose.yml`, such as `${ADMIN_USER}`, and you could use `envsubst` command to do it quckily.
4. Run below command on the same directory of the `docker-compose.yml`.

> docker-compose up -d

---

All done! Check <http://localhost:3000>

### MORE

Create your **db** directory to store your data,and see **docker-compose.yml** [volumes](https://docs.docker.com/engine/reference/builder/#volume) settings.

## Test

> npm test

## Demo

[My Blog](http://blog.reply2future.pw)

## Reference

1.[Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
2.[Manage data in containers](https://docs.docker.com/engine/tutorials/dockervolumes/)

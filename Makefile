# some variable
CUR_DIR := $(PWD)

# container information
NODE_IMAGE_NAME = node-env
NODE_CONTAINER_NAME = node-blog
NODE_IMAGE_VERSION = node:8-alpine
LOCAL_PORT = 3000
COOKIE_SECRET = test
SESSION_SECRET = test
TWITTER_KEY = test
TWITTER_SECRET = test

# options
REPORTER = list
MOCHA_OPTS = --ui bdd -c
NODE_DEV_ENV = NODE_ENV=development
PROCESS_ENV = PORT=$(LOCAL_NODE_DEBUG_PORT) COOKIE_SECRET=$(COOKIE_SECRET) SESSION_SECRET=$(SESSION_SECRET) TWITTER_KEY=$(TWITTER_KEY) TWITTER_SECRET=$(TWITTER_SECRET)

# one click deploy for debug and test
one-click-test: docker-deploy docker-test
	@echo ****************** test finished. ********************
clean:
	@echo ****************** clean test docker *****************
	-docker kill $(NODE_CONTAINER_NAME) 
	docker rm -v $(NODE_CONTAINER_NAME)

docker-deploy:
	@echo ****************** Run container *********************
	docker run --name $(NODE_CONTAINER_NAME) \
		-p $(LOCAL_PORT):3000 \
		-w="/usr/src/app" \
		-v $(CUR_DIR):/usr/src/app \
		-d $(NODE_IMAGE_VERSION) /bin/sh -c "sleep 1d"
	@echo ***************** Install make ***********************
	docker exec -it $(NODE_CONTAINER_NAME) sh -c "apk add --no-cache make"

test:
	$(NODE_DEV_ENV) \
	$(PROCESS_ENV) \
		./node_modules/nyc/bin/nyc.js \
		./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS) \
		tests/*.js

run:
	$(PROCESS_ENV) \
		npm start 

docker-test:
	docker exec -it $(NODE_CONTAINER_NAME) \
		make test
docker-run:
	docker exec -it $(NODE_CONTAINER_NAME) \
		make run

# pm2-runtime command
reload_serv:
	docker-compose exec server pm2 reload blog

list_serv:
	docker-compose exec server pm2 list

log_serv:
	docker-compose exec server pm2 logs --lines 200 -f

access_serv:
	docker-compose exec server sh

npm_i:
	docker-compose exec server npm i --only=production

.PHONY: test docker-deploy docker-test run docker-run

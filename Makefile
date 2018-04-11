# some variable
CUR_DIR := $(PWD)
DB_DIR := $(CUR_DIR)/db

# container information
NODE_IMAGE_NAME = node-env
NODE_CONTAINER_NAME = node-blog
# make test easy
NODE_IMAGE_VERSION = node:8-alpine
NODE_DEBUG_IMAGE_NAME = node-dev-env
NODE_DEBUG_CONTAINER_NAME = node-blog-debug
LOCAL_NODE_DEBUG_PORT = 3000
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
one-click-test: docker-node-debug-deploy docker-node-debug-test
	@echo ****************** test finished. ********************
clean:
	@echo ****************** clean test docker *****************
	-docker kill $(NODE_DEBUG_CONTAINER_NAME) 
	docker rm -v $(NODE_DEBUG_CONTAINER_NAME)

docker-node-debug-deploy:
	@echo ****************** Run container *********************
	docker run --name $(NODE_DEBUG_CONTAINER_NAME) \
		-p $(LOCAL_NODE_DEBUG_PORT):3000 \
		-w="/usr/src/app" \
		-v $(CUR_DIR):/usr/src/app \
		-d $(NODE_IMAGE_VERSION) /bin/sh -c "node docker/node/daemon.js"
	@echo ***************** Install make ***********************
	docker exec -it $(NODE_DEBUG_CONTAINER_NAME) sh -c "apk add --no-cache make"

test:
	$(NODE_DEV_ENV) \
	$(PROCESS_ENV) \
		./node_modules/nyc/bin/nyc.js \
		./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS) \
		tests/*.js

docker-node-debug-test:
	docker exec -it $(NODE_DEBUG_CONTAINER_NAME) \
		make test

.PHONY: test docker-node-debug-deploy docker-node-debug-test

# include variable file Makefile.config
include Makefile.config

# some variable
CUR_DIR := $(PWD)
DB_DIR := $(CUR_DIR)/db

MONGO_ADD_ADMIN_EVAL = "db.createUser({ user: '$(MONGO_ADMIN)', pwd: '$(MONGO_ADMIN_PWD)', roles: [{ role: 'userAdminAnyDatabase', db: 'admin' } ] });"
MONGO_ADD_BLOG_EVAL = "db = db.getSiblingDB('blog'); db.createUser({ user: '$(MONGO_BLOG_USER)', pwd: '$(MONGO_BLOG_PWD)', roles: [{ role: 'readWrite', db: 'blog' } ] });"


# container information
MONGO_IMAGE_NAME = mongodb-env
MONGO_CONTAINER_NAME = mongodb-blog
NODE_LINK_MONGO_ALIAS = mongodb-blog
NODE_IMAGE_NAME = node-env
NODE_CONTAINER_NAME = node-blog
NGINX_IMAGE_NAME = nginx-env
NGINX_DEBUG_CONTAINER_NAME = nginx-blog-debug
NGINX_CONTAINER_NAME = nginx-blog
NGINX_LINK_NODE_ALIAS = node-blog-host
# make test easy
NODE_IMAGE_VERSION = node:8-alpine
NODE_DEBUG_IMAGE_NAME = node-dev-env
NODE_DEBUG_CONTAINER_NAME = node-blog-debug
LOCAL_NODE_DEBUG_PORT = 3000
LOCAL_NGINX_PORT = 80

# options
REPORTER = list
MOCHA_OPTS = --ui bdd -c
NODE_PRO_ENV = NODE_ENV=production
PROCESS_ENV = PORT=3000 MONGOHQ_URL=mongodb://$(MONGO_BLOG_USER):$(MONGO_BLOG_PWD)@$(NODE_LINK_MONGO_ALIAS):27017/blog COOKIE_SECRET=$(COOKIE_SECRET) SESSION_SECRET=$(SESSION_SECRET) TWITTER_KEY=$(TWITTER_KEY) TWITTER_SECRET=$(TWITTER_SECRET)

# clear docker container and image
# first argument is image name and second argument is container name
define dockerClear
	@echo ***************** Kill process ***********************
	@echo ***************** Remove container *******************
	-docker kill $(2) 
	docker rm -v $(2)
	@echo ***************** Remove image ***********************
	docker rmi $(1)
endef

# one click deploy all
one-click-deploy: docker-deploy-mongodb docker-deploy-node docker-deploy-nginx

one-click-destroy: docker-destroy-nginx docker-destroy-node docker-destroy-mongodb

# one click deploy for debug and test
one-click-deploy-debug: docker-deploy-mongodb docker-deploy-node-debug docker-deploy-nginx-debug

docker-deploy-nginx:
	@echo ****************** Build image ***********************
	docker build -t $(NGINX_IMAGE_NAME) \
		--file docker/nginx/Dockerfile .
	@echo ****************** Run container *********************
	docker run --name $(NGINX_CONTAINER_NAME) \
		-p $(LOCAL_NGINX_PORT):80 \
		--link $(NODE_CONTAINER_NAME):$(NGINX_LINK_NODE_ALIAS) \
		-d $(NGINX_IMAGE_NAME)

docker-deploy-node:
	@echo ****************** Build image ***********************
	docker build -t $(NODE_IMAGE_NAME) \
		--file docker/node/Dockerfile .
	@echo ****************** Run container *********************
	docker run --name $(NODE_CONTAINER_NAME) \
		--link $(MONGO_CONTAINER_NAME):$(NODE_LINK_MONGO_ALIAS) \
		-d $(NODE_IMAGE_NAME)

docker-deploy-node-debug:
	@echo ****************** Run container *********************
	docker run --name $(NODE_DEBUG_CONTAINER_NAME) \
		-p $(LOCAL_NODE_DEBUG_PORT):3000 \
		-w="/usr/src/app" \
		-v $(CUR_DIR):/usr/src/app \
		--link $(MONGO_CONTAINER_NAME):$(NODE_LINK_MONGO_ALIAS) \
		-d $(NODE_IMAGE_VERSION) /bin/sh -c "node docker/node/daemon.js"
	@echo ***************** Install make ***********************
	docker exec -it $(NODE_DEBUG_CONTAINER_NAME) sh -c "apk add --no-cache make"

docker-deploy-nginx-debug:
	@echo ****************** Build image ***********************
	docker build -t $(NGINX_IMAGE_NAME) \
		--file docker/nginx/Dockerfile .
	@echo ****************** Run container *********************
	docker run --name $(NGINX_DEBUG_CONTAINER_NAME) \
		-p $(LOCAL_NGINX_PORT):80 \
		-v $(CUR_DIR)/public:/usr/src/app/static \
		--link $(NODE_DEBUG_CONTAINER_NAME):$(NGINX_LINK_NODE_ALIAS) \
		-d $(NGINX_IMAGE_NAME)
	
docker-deploy-mongodb:
	@echo ****************** Build image ***********************
	docker build -t $(MONGO_IMAGE_NAME) \
		--file docker/mongodb/Dockerfile .
	@echo ****************** Run mongodb container *************
	docker run --name $(MONGO_CONTAINER_NAME) \
		-v $(DB_DIR):/usr/src/sharedir \
		-d -t $(MONGO_IMAGE_NAME) --auth
	@sleep 1
	@echo ****************** Config admin mongodb ********************
	docker exec -it $(MONGO_CONTAINER_NAME) \
		mongo admin --eval \
		$(MONGO_ADD_ADMIN_EVAL) 
	@echo ****************** add read and write user **********
	docker exec -it $(MONGO_CONTAINER_NAME) \
		mongo -u $(MONGO_ADMIN) -p $(MONGO_ADMIN_PWD) \
		--authenticationDatabase \
	   	admin --eval \
		$(MONGO_ADD_BLOG_EVAL) 
	@echo ****************** Init blog database ****************
	docker exec -it $(MONGO_CONTAINER_NAME) \
		mongoimport --username $(MONGO_BLOG_USER) \
		--password $(MONGO_BLOG_PWD) \
		--authenticationDatabase blog \
		--db blog --collection users \
		--type json --file users.json \
		--jsonArray
	docker exec -it $(MONGO_CONTAINER_NAME) \
		mongoimport --username $(MONGO_BLOG_USER) \
		--password $(MONGO_BLOG_PWD) \
		--authenticationDatabase blog \
		--db blog --collection articles \
		--type json --file articles.json \
		--jsonArray
	docker restart $(MONGO_CONTAINER_NAME)

docker-destroy-mongodb: docker-backup-db
	$(call dockerClear, $(MONGO_IMAGE_NAME), $(MONGO_CONTAINER_NAME))

docker-destroy-node:
	$(call dockerClear, $(NODE_IMAGE_NAME), $(NODE_CONTAINER_NAME))

docker-destroy-nginx:
	$(call dockerClear, $(NGINX_IMAGE_NAME), $(NGINX_CONTAINER_NAME))

docker-destroy-nginx-debug:
	$(call dockerClear, $(NGINX_IMAGE_NAME), $(NGINX_DEBUG_CONTAINER_NAME))

docker-backup-db:
	@echo ****************** backup blog data ****************
	docker exec -it $(MONGO_CONTAINER_NAME) \
		mongoexport --username $(MONGO_BLOG_USER) \
		--password $(MONGO_BLOG_PWD) \
		--authenticationDatabase blog \
		--db blog --collection users \
		--out users.json \
		--jsonArray
	docker exec -it $(MONGO_CONTAINER_NAME) \
		mongoexport --username $(MONGO_BLOG_USER) \
		--password $(MONGO_BLOG_PWD) \
		--authenticationDatabase blog \
		--db blog --collection articles \
		--out articles.json \
		--jsonArray

insert-db:
	@echo ****************** Seeding blog **********************
	./db/seed.sh

test:
	$(PROCESS_ENV) \
		./node_modules/nyc/bin/nyc.js \
		./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS) \
		tests/*.js

debug-test:
	$(PROCESS_ENV) ./node_modules/mocha/bin/mocha \
		$(MOCHA_OPTS) \
		debug \
		tests/*.js

debug:
	$(PROCESS_ENV) node debug bin/www

dev-start:
	$(PROCESS_ENV) node ./bin/www

# production environment
start:
	$(NODE_PRO_ENV) $(PROCESS_ENV) node ./bin/www

docker-access-blog-mongodb:
	docker exec -it ${MONGO_CONTAINER_NAME} \
		mongo -u ${MONGO_BLOG_USER} \
		-p ${MONGO_BLOG_PWD} blog

docker-node-debug-test:
	docker exec -it $(NODE_DEBUG_CONTAINER_NAME) \
		make test

docker-node-debug-debug:
	docker exec -it $(NODE_DEBUG_CONTAINER_NAME) \
		make debug
.PHONY: test insert-db debug inspect start debug-test docker-deploy-mongodb docker-destroy-mongodb docker-destroy-node docker-deploy-node one-click-deploy docker-backup-db docker-deploy-node-debug docker-access-blog-mongodb docker-deploy-nginx docker-destroy-nginx docker-deploy-nginx-debug docker-destroy-nginx-debug docker-node-debug-test docker-node-debug-debug dev-start one-click-deploy-debug

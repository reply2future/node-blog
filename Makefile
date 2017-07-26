REPORTER = list
MOCHA_OPTS = --ui bdd -c
PROCESS_ENV = PORT=3000 MONGOHQ_URL=mongodb://mongodb-blog:27017/blog

insert-db:
	echo ****************** Seeding blog **********************
	./db/seed.sh

test:
	clear
	./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS) \
		tests/*.js

debug:
	$(PROCESS_ENV) node debug bin/debug

# Deprecated feature
inspect:
	$(PROCESS_ENV) node --inspect ./bin/debug

start:
	$(PROCESS_ENV) node ./bin/debug

.PHONY: test insert-db debug inspect start

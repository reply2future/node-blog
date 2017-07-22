REPORTER = list
MOCHA_OPTS = --ui bdd -c

test:
	clear
	./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS) \
		tests/*.js
.PHONY: test

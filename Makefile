install:
	@npm install

build:
	@NODE_ENV=production ./node_modules/.bin/babel ./src -d lib --ignore '*.spec.js'

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babel-register './src/*.spec.js'

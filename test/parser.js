var assert = require('assert'),
	routerules = require('../'),
	path = require('path'),
	opts = {
		basePath: path.resolve(__dirname, 'handlers')
	},
	simpleHandler = require('./handlers/simple');

describe('routerules parser tests', function() {
	it('should be able to parse a simple get handler', function() {
		var ruleset = routerules('GET /hello => simple.hello', opts);

		assert.equal(ruleset.rules.length, 1);
		assert.equal(ruleset.rules[0].method, 'GET');
		assert.equal(ruleset.rules[0].pattern, '/hello');
		assert.strictEqual(ruleset.rules[0].handler, simpleHandler.hello);
	});

	it('should be able to parse a simple handler without a method definition', function() {
		var ruleset = routerules('GET /hello => simple.hello', opts);

		assert.equal(ruleset.rules.length, 1);
		assert.equal(ruleset.rules[0].method, 'GET');
		assert.equal(ruleset.rules[0].pattern, '/hello');
		assert.strictEqual(ruleset.rules[0].handler, simpleHandler.hello);
	});
});
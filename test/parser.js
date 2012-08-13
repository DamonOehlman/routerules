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
		var ruleset = routerules('/hello => simple.hello', opts);

		assert.equal(ruleset.rules.length, 1);
		assert.equal(ruleset.rules[0].method, 'GET');
		assert.equal(ruleset.rules[0].pattern, '/hello');
		assert.strictEqual(ruleset.rules[0].handler, simpleHandler.hello);
	});

	it('should be able to add definitions after calling the original parse', function() {
		var ruleset = routerules('GET /hello => simple.hello', opts)
						.add('/hello => simple.hello');

		assert.equal(ruleset.rules.length, 2);

		ruleset.rules.forEach(function(rule) {
			assert.equal(rule.method, 'GET');
			assert.equal(rule.pattern, '/hello');
			assert.strictEqual(rule.handler, simpleHandler.hello);
		});
	});
});
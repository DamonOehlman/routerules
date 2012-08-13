var assert = require('assert'),
	routerules = require('../'),
	path = require('path'),
	opts = {
		basePath: path.resolve(__dirname, 'handlers')
	},
	simpleHandler = require('./handlers/simple'),
	ruleset;

describe('routerules mountpoint tests', function() {
	it('should be able to create a simple ruleset', function() {
		ruleset = routerules('GET /hello => simple.hello', opts);

		assert.equal(ruleset.rules.length, 1);
		assert.equal(ruleset.rules[0].method, 'GET');
		assert.equal(ruleset.rules[0].pattern, '/hello');
		assert.strictEqual(ruleset.rules[0].handler, simpleHandler.hello);
	});

	it('should be able to specify a mountpoint for the ruleset', function() {
		ruleset.mount('test');

		assert.equal(ruleset.rules.length, 1);
		assert.equal(ruleset.rules[0].method, 'GET');
		assert.equal(ruleset.rules[0].pattern, '/test/hello');
		assert.strictEqual(ruleset.rules[0].handler, simpleHandler.hello);
	});

	it('should be able to add another rule to the ruleset, and have the mountpoint retained', function() {
		ruleset.add('/hello => simple.hello');

		assert.equal(ruleset.rules.length, 2);

		ruleset.rules.forEach(function(rule) {
			assert.equal(rule.method, 'GET');
			assert.equal(rule.pattern, '/test/hello');
			assert.strictEqual(rule.handler, simpleHandler.hello);
		});
	});

	it('should be able to change the mountpoint and have it reflected in all rules', function() {
		ruleset.mount('test2');
		assert.equal(ruleset.rules.length, 2);

		ruleset.rules.forEach(function(rule) {
			assert.equal(rule.method, 'GET');
			assert.equal(rule.pattern, '/test2/hello');
			assert.strictEqual(rule.handler, simpleHandler.hello);
		});
	});
});
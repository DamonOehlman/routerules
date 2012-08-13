var assert = require('assert'),
	routerules = require('../'),
	path = require('path'),
	opts = {
		basePath: path.resolve(__dirname, 'handlers')
	};

describe('routerules parser tests', function() {
	it('should be able to parse a simple get handler', function() {
		var ruleset = routerules('GET /hello => simple.hello', opts);

		assert.equal(ruleset.rules.length, 1);
		assert.equal(ruleset.rules[0].method, 'GET');
		assert.equal(ruleset.rules[0].pattern, '/hello');
		assert.equal(typeof ruleset.rules[0].handler, 'function');
	});
});
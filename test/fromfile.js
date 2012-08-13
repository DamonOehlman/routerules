var assert = require('assert'),
	routerules = require('../'),
	path = require('path');

describe('text file loading tests', function() {
	it('should be able to load a suite of route rules from a text file', function(done) {
		routerules.load(path.resolve(__dirname, 'routes.txt'), function(err, rules) {
			assert.ifError(err);

			done(err);
		});
	});
});
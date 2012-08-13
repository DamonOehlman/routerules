var assert = require('assert'),
	routerules = require('../../'),
	path = require('path'),
	tako = require('tako'),
	routesFile = path.resolve(__dirname, 'tako', 'routes.txt'),
	app, ruleset;

describe('tako framework tests', function() {
	before(function() {
		app = tako();
	});

	it('should be able to load the ruleset', function(done) {
		routerules.load(routesFile, function(err, set) {
			assert.ifError(err);
			assert(set);

			ruleset = set;
			done();
		});
	});
});
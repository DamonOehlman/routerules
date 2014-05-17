var assert = require('assert');
var routerules = require('../');
var path = require('path');
var routesFile = path.resolve(__dirname, 'simple.txt');
var opts = {
  basePath: path.resolve(__dirname, 'handlers')
};

describe('text file loading tests', function() {
  it('should be able to load a suite of route rules from a text file', function(done) {
    routerules.load(routesFile, opts, function(err, ruleset) {
      assert.ifError(err);
      assert.equal(ruleset.rules.length, 2);

      done(err);
    });
  });
});

var debug = require('debug')('routerules');
var reLeadingSlashes = /^\//;

function Rule(ruleset, opts) {
  if (! (this instanceof Rule)) {
    return new Rule(ruleset, opts);
  }

  this.owner = ruleset;

  // initialise method and handler
  this.method = (opts || {}).method || 'GET';
  this.handler = (opts || {}).handler;

  // initialise the internal pattern property
  this._pattern = (opts || {}).pattern;
}

module.exports = Rule;

Object.defineProperty(Rule.prototype, 'pattern', {
  get: function() {
    var pattern = this._pattern;

    // if we have an owner and a mount point, then prepend the mountpoint
    if (this.owner && this.owner.mountpoint) {
      pattern = this.owner.mountpoint + '/' + pattern.replace(reLeadingSlashes, '');
    }

    return pattern;
  },

  set: function(value) {
    this._pattern = value;
  }
});

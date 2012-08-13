var debug = require('debug')('routerules'),
	reLeadingSlashes = /^\//;

function Rule(ruleset, opts) {
	this.owner = ruleset;

	// ensure we have opts
	opts = opts || {};

	// initialise method and handler
	this.method = opts.method || 'GET';
	this.handler = opts.handler;

	// initialise the internal pattern property
	this._pattern = opts.pattern;
}

Rule.prototype = {

};

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

module.exports = Rule;
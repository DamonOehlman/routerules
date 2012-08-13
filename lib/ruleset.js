var path = require('path'),
	reHandlerDelim = /[\.\/]/;

function Ruleset(opts) {
	// ensure we have opts
	opts = opts || {};

	// get the base path
	this.basePath = opts.basePath || process.cwd();

	// initialise an empty rules array
	this.rules = [];
}

Ruleset.prototype = {
	add: function(method, pattern, handlerPath) {
		var handlerParts = handlerPath.split(reHandlerDelim),
			handlerFilename,
			handler;

		// first try and require the full handler instance and map the handler
		// directly to the module export
		try {
			handlerFilename = path.resolve(this.basePath, handlerParts.join('/'));
			handler = require(handlerPath);

			// if the handler is defined, and we have an index export
			// pass through to the index function
			if (handler && typeof handler.index == 'function') {
				handler = handler.index;
			}
			// if the handler is not a function, then remove the reference
			else if (typeof handler != 'function') {
				handler = undefined;
			}
		}
		catch (e) {
			// handler was not found at the full path reference, we will continue our search
		}

		// if we don't have a handler yet, then look for a file based on the first length-1 parts
		if (! handler) {
			try {
				handlerFilename = path.resolve(this.basePath, handlerParts.slice(0, -1).join('/'));
				handler = require(handlerFilename);

				// if we have a handler, then look for the handler method (last part)
				if (handler) {
					handler = handler[handlerParts.slice(-1)[0]];
				}
			}
			catch (e) {
				// no handler still, this isn't going well
			}
		}

		// if the handler is undefined, then throw an error
		if (typeof handler != 'function') {
			throw new Error('Unable to locate handler function for: ' + handlerPath);
		}

		// add the rule
		this.rules.push({
			method: method,
			pattern: pattern,
			handler: handler
		});
	}
};

module.exports = Ruleset;
var debug = require('debug')('routerules'),
	path = require('path'),
	Rule = require('./rule'),
	reRoute = /([A-Z]+)?\s?([^\s]*)\s+=\>\s+(.*)/,
	reHandlerDelim = /[\.\/]/,
	reLeadingAndTrailingSlashes = /^\/|\/$/;

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
		var matchResult, handlerParts,
			handlerFilename, handlerMethod, lastErr,
			handler,
			rule;

		// if we only one argument, then throw it at the regex
		if (arguments.length === 1) {
			matchResult = reRoute.exec(method);

			// if we got nothing, then return this
			if (! matchResult) return this;

			// otherwise, update the method pattern and handler path arguments
			method = matchResult[1];
			pattern = matchResult[2];
			handlerPath = matchResult[3];
		}

		// ensure the method is valid
		method = method || 'GET';

		// initialise the handler parts
		handlerParts = handlerPath.split(reHandlerDelim);

		// first try and require the full handler instance and map the handler
		// directly to the module export
		try {
			handlerFilename = path.resolve(this.basePath, handlerParts.join('/'));
			debug('attempting to load index route handler from: ' + handlerFilename);
			handler = require(handlerFilename);

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
			// if the error is not the result of not finding the requested module
			// 0.0.2: Added detection for code as not all node versions have this and we should try again as the default action
			if (e.code && (e.code !== 'MODULE_NOT_FOUND' || e.message.indexOf(handlerParts.slice(-1)) < 0)) {
				lastErr = e;
			}
		}

		// if we don't have a handler yet, then look for a file based on the first length-1 parts
		if ((! lastErr) && (! handler)) {
			try {
				handlerFilename = path.resolve(this.basePath, handlerParts.slice(0, -1).join('/'));
				handlerMethod = handlerParts.slice(-1)[0];

				debug('attempting to load  method "' + handlerMethod + '" from route handler: ' + handlerFilename);
				handler = require(handlerFilename);

				// if we have a handler, then look for the handler method (last part)
				if (handler) {
					handler = handler[handlerMethod];
				}
			}
			catch (e) {
				// save the last error
				lastErr = e;
			}
		}

		// if we have an error, then report an error
		if (lastErr || typeof handler != 'function') { 
			if (lastErr) {
				debug('captured module load error: ', lastErr);
			}

			throw new Error('Unable to locate handler function for: ' + handlerPath);
		}

		// create the new rule
		rule = new Rule(this, {
			method: method,
			pattern: pattern,
			handler: handler
		});

		// add the rule
		this.rules.push(rule);

		return this;
	},

	mount: function(mountpoint) {
		this.mountpoint = mountpoint.replace(reLeadingAndTrailingSlashes, '');

		// if we have a mount point top and tail it with slashes
		if (this.mountpoint) {
			this.mountpoint = '/' + this.mountpoint;
		}
	}
};

module.exports = Ruleset;
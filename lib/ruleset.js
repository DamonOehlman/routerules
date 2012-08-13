var debug = require('debug')('routerules'),
	path = require('path'),
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
			handlerFilename, handlerMethod, lastErr,
			handler;

		// first try and require the full handler instance and map the handler
		// directly to the module export
		try {
			handlerFilename = path.resolve(this.basePath, handlerParts.join('/'));
			debug('attempting to load index route handler from: ' + handlerFilename);
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
			// if the error is not the result of not finding the requested module
			if (e.code !== 'MODULE_NOT_FOUND' || e.message.indexOf(handlerParts.slice(-1)) < 0) {
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

		// add the rule
		this.rules.push({
			method: method,
			pattern: pattern,
			handler: handler
		});
	}
};

module.exports = Ruleset;
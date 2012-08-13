var fs = require('fs'),
	path = require('path'),
	Ruleset = require('./lib/ruleset'),
	reRoute = /([A-Z]+)?\s?([^\s]*)\s*=\>\s*(.*)/;

/**
# routerules

Read the specified input lines, and return a RouteRules object if successful
*/
function routerules(lines, opts) {
	var ruleset;

	// ensure we have opts and callback
	opts = opts || {};

	// create the rulelist
	ruleset = new Ruleset(opts);

	// iterate through the lines and create the rules list
	[].concat(lines || []).forEach(function(line) {
		var result = reRoute.exec(line);

		// if this was a valid route result, then create a new rule
		if (result) {
			// create 
			ruleset.add(result[1] || 'GET', result[2], result[3]);
		}
	});

	return ruleset;
}

/**
## routerules.load 

Load the specified text file, split on newline characters load into route rules
*/
routerules.load = function(targetFile, opts, callback) {
	var err;

	// handle the 2 argument case
	if (typeof opts == 'function') {
		callback = opts;
		opts = {};
	}

	// ensure we have opts and callback
	opts = opts || {};

	// read the specified target file, and parse the results onto the main routerules fn
	fs.readFile(targetFile, opts.encoding || 'utf8', function(err, data) {
		if (err) return callback(err);

		// initialise the basePath to the cwd directory
		opts.basePath = opts.basePath || path.dirname(targetFile);

		// initialise the routerules
		try {
			var ruleset = routerules(data.split(/\n\r?/), opts);
		}
		catch (e) {
			err = e;
		}

		// if we have a callback, then trigger it
		if (typeof callback == 'function') {
			callback(err, ruleset);
		}
	});
};

_parse = routerules.parse = function(line, ruleset) {

	return ruleset;
};

module.exports = routerules;
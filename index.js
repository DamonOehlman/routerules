var fs = require('fs'),
	path = require('path'),
	RuleList = require('./lib/rulelist'),
	reRoute = /([A-Z]+)?\s?([^\s]*)\s*=\>\s*(.*)/;

/**
# routerules

Read the specified input lines, and return a RouteRules object if successful
*/
function routerules(lines, opts, callback) {
	var rules = new RuleList();

	// handle the 2 arguments case
	if (typeof opts == 'function') {
		callback = opts;
		opts = {};
	}

	// ensure we have opts and callback
	opts = opts || {};
	callback = callback || function() {};

	// iterate through the lines and create the rules list
	(lines || []).forEach(function(line) {
		var result = reRoute.exec(line);

		// if this was a valid route result, then create a new rule
		if (result) {
			// create 
			rules.add(result[1] || 'GET', result[2], result[3]);
		}
	});

	// execute the callback
	callback(null, null);
}

/**
## routerules.load 

Load the specified text file, split on newline characters load into route rules
*/
routerules.load = function(targetFile, opts, callback) {
	// handle the 2 arguments case
	if (typeof opts == 'function') {
		callback = opts;
		opts = {};
	}

	// ensure we have opts and callback
	opts = opts || {};
	callback = callback || function() {};

	// read the specified target file, and parse the results onto the main routerules fn
	fs.readFile(targetFile, opts.encoding || 'utf8', function(err, data) {
		if (err) return callback(err);

		routerules(data.split(/\n\r?/), opts, callback);
	});
};

module.exports = routerules;
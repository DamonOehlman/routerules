function RuleList() {

}

RuleList.prototype = {
	add: function(method, pattern, handlerPath) {
		console.log(method, pattern, handlerPath);
	}
};

module.exports = RuleList;
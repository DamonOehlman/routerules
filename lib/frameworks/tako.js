module.exports = function(app, ruleset, opts) {
  ruleset.rules.forEach(function(rule) {
    app.route(rule.pattern, rule.handler).methods(rule.method);
  })

  // if we have a port specified, the auto listen
  if (opts.port) {
    app.httpServer.listen(opts.port);
  }

  return app;
};

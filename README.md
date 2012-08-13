# routerules

This module is used to direct url routes to particular Node.js module handlers, which allows a user to define a text file of routes and have those bound to particular modules and appropriate exports.

While the core of `routerules` designed to be framework agnostic, a suite of framework helpers are provided which will help with wiring the detected routes in platform appropriate ways.  Out of the box, the following route wirers are included:

- express
- connect
- union
- tako

Additionally, some bridging adaptors are provided which can enable you to take existing route handlers that are written in an express/connect compatible format (`function(req, res, next)`) and use these within other frameworks.
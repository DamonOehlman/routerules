# routerules

This module is used to direct url routes to particular Node.js module handlers, which allows a user to define a text file of routes and have those bound to particular modules and appropriate exports.

While the core of `routerules` designed to be framework agnostic, a suite of framework helpers are provided which will help with wiring the detected routes in platform appropriate ways.  Out of the box, the following route wirers are included:

- express
- connect
- union
- tako

## Example Usage

In it's simplest form here is what a plaintext route rule looks like:

```
/help/index? => help
```

Which is equivalent to the full equivalent (the `GET` method is assumed when not specified) of:

```
GET /help/index? => help
```

Which can be broken into three parts:

```
METHOD pattern => handler
```

Because `routerules` itself implements no pattern matching itself with regards to routes, the pattern can be just about anything (i.e. anything that doesn't use the ` => ` character string) to define a route.  All the `routerules` module does is create an array of simple routing rule objects which are mapped to a "best fit" handler function.

## Determining the Best Fit Handler Function

The best fit handler function is selected in the following priority order (relative to a module `basePath` which can be provided as an option to the `routerules` function call).

For instance, given rule (`GET /test => full.path.to.handler` or `GET /test => full/path/to/handler`) the best fit handler is determined by checking the following in order:

1. Attempting to require a module at path `full/path/to/handler` that's `module.exports` maps to a function, OR has an `index` function export.

2. Attempting to require the module at path `full/path/to` that exports a `handler` function.

## Loading a full set of Routing Rules

As you can imagine, there is little point using the `routerules` module when you only have a few simple rules in your application.  The real benefit comes when you have a lot of rules and you want to use some external configuration source for those rules.  To assist with this, a `routerules.load` helper is provided which can load rules from a file in a format similar to what is shown below:

```
# Send GET requests for /hello to handlers/test.js (hello export)
GET /hello => simple.hello

# Send GET requests for /hello2 to handlers/test.js (hello export)
/hello => simple.hello
```

Additionally, the `routerules.load` function will set the `basePath` option for targeted modules to the directory of the filename that was specified in the load function call.  In this way, if you were to create a folder that brought together all your route handlers, you could provide a simple text file in that folder to instruct your framework of choice how to wire those handlers up.
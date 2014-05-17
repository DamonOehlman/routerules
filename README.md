# routerules

This module is used to direct url routes to particular module handlers, which
allows a user to define a text file of routes and have those bound to
particular modules and appropriate exports.


[![NPM](https://nodei.co/npm/routerules.png)](https://nodei.co/npm/routerules/)

[![unstable](https://img.shields.io/badge/stability-unstable-yellowgreen.svg)](https://github.com/badges/stability-badges) [![Build Status](https://img.shields.io/travis/DamonOehlman/routerules.svg?branch=master)](https://travis-ci.org/DamonOehlman/routerules) 

## Example Usage

In it's simplest form here is what a plaintext route rule looks like:

```
/help/index? => help
```

Which is equivalent to the full equivalent (the `GET` method is assumed when
not specified) of:

```
GET /help/index? => help
```

Which can be broken into three parts:

```
METHOD pattern => handler
```

Because `routerules` itself implements no pattern matching itself with regards
to routes, the pattern can be just about anything (i.e. anything that doesn't
use the ` => ` character string) to define a route.  All the `routerules`
module does is create an array of simple routing rule objects which are mapped
to a "best fit" handler function.

## Determining the Best Fit Handler Function

The best fit handler function is selected in the following priority order
(relative to a module `basePath` which can be provided as an option to the
`routerules` function call).

For instance, given rule (`GET /test => full.path.to.handler` or
`GET /test => full/path/to/handler`) the best fit handler is determined by
checking the following in order:

1. Attempting to require a module at path `full/path/to/handler` that's
  `module.exports` maps to a function, OR has an `index` function export.

2. Attempting to require the module at path `full/path/to` that exports a
  `handler` function.

## Loading a full set of Routing Rules

As you can imagine, there is little point using the `routerules` module when
you only have a few simple rules in your application.  The real benefit comes
when you have a lot of rules and you want to use some external configuration
source for those rules.  To assist with this, a `routerules.load` helper is
provided which can load rules from a file in a format similar to what is shown
below:

```
# Send GET requests for /hello to handlers/test.js (hello export)
GET /hello => simple.hello

# Send GET requests for /hello2 to handlers/test.js (hello export)
/hello => simple.hello
```

Additionally, the `routerules.load` function will set the `basePath` option
for targeted modules to the directory of the filename that was specified in the
load function call.  In this way, if you were to create a folder that brought
together all your route handlers, you could provide a simple text file in that
folder to instruct your framework of choice how to wire those handlers up.

## Reference

### routerules(lines, opts)

### routerules.load

Load the specified text file, split on newline characters load into route rules

## License(s)

### ISC

Copyright (c) 2014, Damon Oehlman <damon.oehlman@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.

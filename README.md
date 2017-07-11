# package-linter
A linter for npm &amp; node package.json files with a focus on security.

This is currently a proof of concept for a package that reads a `.npmlint` file in a directory and from this can parse a `package.json` file and enforce these rules.

This could then be used in pre-commit/pre-push hooks.

The currently implemented options are:

> ## `includes`: 
> This is an array of features a package must include.  `name` and `version` are hard coded as required, as per npm itself. Then you can add fields that are needed.  There will be an `excludes` also added once the code is moved to be more plugin based.

> ## `scripts`:
> `scripts` is an object that currently takes one property, `allow`.  This scans each script for the know applications and reports
> anything that is not in the list.  For example in this repo it will report `Script test has a unknown executable exit`

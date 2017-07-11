# package-linter
A opinionated, but configurable linter for npm &amp; node package.json files with a focus on security.

[Github](https://github.com/tanepiper/npm-lint) | [Issues](https://github.com/tanepiper/npm-lint/issues) | [NPM](https://www.npmjs.com/package/npm-lint)

## Install

`npm i -g npm-lint`

This is an early concept for a tool that reads a `.npmlint.json` file in a directory and from this can parse a `package.json` file and enforce these rules.

> **Please note the APIs and commands are likely to change quite a bit**

## Concept

The concept on this tool is to enforce rules across many repositories within your organisation. By putting a `.npmlint.json` file in your root directory and running `npm-lint` the tool will check the file to ensure it meets your configuration.

The focus is on security and being able to lock down where dependencies are resolved from, and where packages are published too and being able to implement this in pre-commit/pre-push hooks or CI environments

The currently implemented options are:

> ## `includes`: 
> This is an array of features a package must include.  `name` and `version` are hard coded as required, as per npm itself. Then you can add fields that are needed.  There will be an `excludes` also added once the code is moved to be more plugin based.

> ## `scripts`:
> `scripts` is an object that currently takes one property, `allow`.  This scans each script for the know applications and reports
> anything that is not in the list.  For example in this repo it will report `Script test has a unknown executable exit`

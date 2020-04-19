# npm-lint
A opinionated, but configurable linter for npm &amp; node package.json files with a focus on security.

[Github](https://github.com/tanepiper/npm-lint) | [Issues](https://github.com/tanepiper/npm-lint/issues) | [NPM](https://www.npmjs.com/package/npm-lint)

## Install

`npm i -g npm-lint`

`npm-lint` is build using Typescript on top of `node 8` as it uses `async/await` - however the distribution is compiled and confirmed to work with `node >= 6.5.0`.

> **Please note the APIs and commands are likely to change quite a bit**

## What is npm-lint?

A tool that reads a `.npmlint.json` file in a directory and from this can parse a `package.json` file and enforce these rules.

It's designed to enforce rules across many repositories within your organisation. By putting a `.npmlint.json` file in your root directory and running `npm-lint` the tool will check the file to ensure it meets your configuration.

The focus is on security and being able to lock down where dependencies are resolved from, and where packages are published too and being able to implement this in pre-commit/pre-push hooks or CI environments

The currently implemented options are:

> ## `properties`
> An array of properties a package must include.
>
> The `name` and `version` are hard coded these are always required, so do not need to be added to your list
> If your `package.json` does not have these fields then it will cause a failure on exit
>
> **Example**
> ```json
> {
>     "properties": {
        "private": true,
        "required": ["description", "main", "author", "license"]
      }
> }
> ```

> ## `scripts`
> An object of properties that will handle checking the `scripts` property in your `package.json`
> ### `scripts.allow`
> An array of names of executables allowed to be in scripts.  If a script it found to be using an application not in this list it will cause a failure on exit
>
> **Example**
> ```json
> {
>    "scripts": {
>         "allow": ["node", "npm", "git"]
>     }
> }
> ```

> ## `dependencies`
> An object of properties that will handle checking the `dependencies` and `devDependencies` in your `package.json`
> ### `dependencies.checkLatest`
> A boolean value to determine if a scan of all dependencies should be done and to advise of the latest version
> ### `dependencies.sources`
> An array of strings that are whitelisted to be in dependencies as non-npm sources.  For example if you point to a git dependency, or a private repository then these should be included.  You can reference the entire source or a domain. By default this will accept any valid semver as a valid NPM source. If you use non-semver values such as release tags you also need to include them in this file
>
> **Example**
> ```json
> {
>   "dependencies": {
>        "sources": [
>            "release",
>            "https://github.com",
>            "https://git.myrepo.com/myrepo.git"
>        ]
>    }
> }
> ```

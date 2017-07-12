const defaultNpmLint = require(`${__dirname}/../../default/.npmlint.json`);
const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

module.exports = async cwd => {
  const context = {
    projectRoot: cwd,
    packageFile: `${cwd}/package.json`,
    npmLintFile: '',
    options: {},
    rules: {}
  };

  // First we try load the package.json where this command has been run
  let pkg;
  try {
    pkg = await readFileAsync(context.packageFile, 'utf-8');
    context.package = JSON.parse(pkg);
  } catch (e) {
    return new Error(
      `No valid ${'package.json'.yellow} found at ${cwd.yellow}`.bold
    );
  }

  // Next we parse the package.json for a npmLint key, if there is not one we take this
  // opertunity to set default values or an empty object in case of issues
  let npmLint;
  context.options = pkg.npmLint && pkg.npmLint.options || defaultNpmLint.options || {};
  context.rules = pkg.npmLint && pkg.npmLint.rules || defaultNpmLint.rules || {};
  context.npmLintFile =
    Object.keys(context.options).length > 0 ||
    Object.keys(context.rules).length > 0
      ? `${cwd}/package.json`
      : `${__dirname}/../default/.npmlint.json`;

  // Now we try read the local .npmlint.json which overides all settings
  try {
    npmLint = await readFileAsync(`${cwd}/.npmlint.json`);
    let result = JSON.parse(npmLint);
    if (result) {
      context.options = result.options || {};
      context.rules = result.rules || {};
      context.npmLintFile = `${cwd}/.npmlint.json`;
    }
  } catch (e) {
    return new Error(
      `No ${'.npmlint.json'.yellow} found at ${cwd.yellow}; using defaults`.bold
    );
  }

  // Now we need to add name and version to always be checked in properties
  if (!context.rules.properties) {
    context.rules.properties = ['name', 'version'];
  } else {
    if (!context.rules.properties.includes('name')) {
      context.rules.properties.push('name');
    }
    if (!context.rules.properties.includes('version')) {
      context.rules.properties.push('version');
    }
  }

  return context;
};

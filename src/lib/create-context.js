const defaultNpmLint = require(`${__dirname}/../../default/.npmlint.json`);

// Allows us to support older node version
const promisify = require('util.promisify');

const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

module.exports = async dataObj => {
  const context = Object.assign(
    {
      packageFile: `${dataObj.workingDirectory}/package.json`,
      npmLintFile: '',
      options: {},
      rules: {}
    },
    dataObj
  );

  // First we try load the package.json where this command has been run
  let pkg;
  try {
    pkg = await readFileAsync(context.packageFile, 'utf-8');
    context.package = JSON.parse(pkg);
  } catch (e) {
    // If no package file it found we want to exit early
    let error = new Error(
      `No valid ${'package.json'.yellow} found at ${context.workingDirectory.yellow}`.bgRed.bold
    );
    throw error;
  }

  // Next we parse the package.json for a npmLint key, if there is not one we take this
  // opertunity to set default values or an empty object in case of issues
  let npmLint;
  context.options =
    (pkg.npmLint && pkg.npmLint.options) || defaultNpmLint.options || {};
  context.rules =
    (pkg.npmLint && pkg.npmLint.rules) || defaultNpmLint.rules || {};
  context.npmLintFile =
    Object.keys(context.options).length > 0 ||
    Object.keys(context.rules).length > 0
      ? `${dataObj.workingDirectory}/package.json`
      : `${__dirname}/../default/.npmlint.json`;

  // Now we try read the local .npmlint.json which overides all settings
  try {
    npmLint = await readFileAsync(`${dataObj.workingDirectory}/.npmlint.json`);
    let result = JSON.parse(npmLint);
    if (result) {
      context.options = result.options || {};
      context.rules = result.rules || {};
      context.npmLintFile = `${dataObj.workingDirectory}/.npmlint.json`;
    }
  } catch (e) {
    context.warnings.insert({
      message: `No ${'.npmlint.json'.bgRed } found at ${dataObj.workingDirectory
        .bgRed}; using defaults`
    });
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

// Allows us to support older node version
import promisify = require('util.promisify');

import fs = require('fs');
const readFileAsync = promisify(fs.readFile);

import * as constants from 'constants';

export default async (dataObj: any): Promise<object> => {
  const context = {
      packageFile: `${dataObj.workingDirectory}/package.json`,
      npmLintFile: '',
      options: {},
      rules: {},
      ...dataObj
  };

  // First we try load the package.json where this command has been run
  let pkg;
  try {
    pkg = await readFileAsync(context.packageFile, 'utf-8');
    context.package = JSON.parse(pkg);
  } catch (e) {
    // If no package file it found we want to exit early
    const error = new Error(
      `No valid ${'package.json'.yellow} found at ${context.workingDirectory.yellow}`.bgRed.bold
    );
    throw error;
  }

  // Next we parse the package.json for a npmLint key, if there is not one we take this
  // opertunity to set default values or an empty object in case of issues
  let npmLint;

  // Now we try read the local .npmlint.json which overides all settings
  try {
    npmLint = await readFileAsync(`${dataObj.workingDirectory}/.npmlint.json`);
    const result = JSON.parse(npmLint);
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

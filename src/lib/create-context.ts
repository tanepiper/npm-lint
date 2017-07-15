// Allows us to support older node version
import promisify = require('util.promisify');

import fs = require('fs');
const readFileAsync = promisify(fs.readFile);

import * as types from '../types';
import * as constants from '../constants';

export default async (currentContext: types.IContextObject): Promise<types.IContextObject> => {
    const context: types.IContextObject = {
        packageFile: `${currentContext.workingDirectory}/package.json`,
        npmLintFile: '',
        ...currentContext
    };

    // First we try load the package.json where this command has been run
    try {
        const pkg = await readFileAsync(context.packageFile, 'utf-8');
        context.package = JSON.parse(pkg);
    } catch (e) {
        // If no package file it found we want to exit early
        const error = new Error(`No valid ${'package.json'.yellow} found at ${context.workingDirectory.yellow}`.bgRed.bold);
        throw error;
    }

    // Next we parse the package.json for a npmLint key, if there is not one we take this
    // opertunity to set default values or an empty object in case of issues
    let npmLint;

    // Now we try read the local .npmlint.json which overides all settings
    try {
        npmLint = await readFileAsync(`${context.workingDirectory}/.npmlint.json`);
        const result = JSON.parse(npmLint);
        if (result) {
            context.options = result.options || {};
            context.rules = result.rules || {};
            context.npmLintFile = `${context.workingDirectory}/.npmlint.json`;
        }
    } catch (e) {
        // Check if there is a options list in the package.json
        if (context.package.npmLint) {
            context.options = context.package.npmLint.options || {};
            context.rules = context.package.npmLint.rules || {};
            context.npmLintFile = `${context.workingDirectory}/package.json`;

            context.warnings.insert({
                message: `No ${'.npmlint.json'.bgRed} found at ${context.workingDirectory.bgRed}; Using package.json settings`
            });
        } else {
            context.options = constants.DEFAULT_CONFIG.options;
            context.rules = constants.DEFAULT_CONFIG.rules || {};
            context.npmLintFile = `default`;

            context.warnings.insert({
                message: `No ${'.npmlint.json'.bgRed} found at ${context.workingDirectory.bgRed}; Using default settings`
            });
        }
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

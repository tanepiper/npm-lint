import promisify = require('util.promisify');

import fs = require('fs');
const readFileAsync = promisify(fs.readFile);

import * as types from '../types';

export default async (currentContext: types.IContextObject): Promise<object> => {
    /// Next we parse the package.json for a npmLint key, if there is not one we take this
    // opertunity to set default values or an empty object in case of issues
    let npmLint: { options; rules; lintFile } = { options: {}, rules: {}, lintFile: '' };

    // Now we try read the local .npmlint.json which overides all settings
    try {
        const file = await readFileAsync(`${currentContext.workingDirectory}/.npmlint.json`);
        const result = JSON.parse(file);
        if (result) {
            npmLint.options = result.options || {};
            npmLint.rules = result.rules || {};
            npmLint.lintFile = `${currentContext.workingDirectory}/.npmlint.json`;
        }
    } catch (e) {
        // Check if there is a options list in the package.json
        if (currentContext.package && typeof currentContext.package.npmLint !== 'undefined') {
            npmLint.options = currentContext.package.npmLint.options || {};
            npmLint.rules = currentContext.package.npmLint.rules || {};
            npmLint.lintFile = `${currentContext.workingDirectory}/package.json`;

            currentContext.info.insert({
                message: `No ${'.npmlint.json'.bgRed} found at ${currentContext.workingDirectory.bgRed}; Using package.json settings`
            });
        } else {
            npmLint = {
                options: {},
                rules: {
                    properties: ['description', 'main', 'author', 'license'],
                    scripts: {
                        allow: ['node', 'npm', 'echo', 'exit']
                    },
                    dependencies: {
                        checkLatest: false,
                        allowLatest: false,
                        sources: []
                    }
                },
                lintFile: false
            };

            currentContext.warnings.insert({
                message: `No ${'.npmlint.json'.bgRed} found at ${currentContext.workingDirectory.bgRed}; Using default settings`
            });
        }
    }

    return npmLint;
};

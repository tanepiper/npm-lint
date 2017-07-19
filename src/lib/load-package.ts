import promisify = require('util.promisify');

import fs = require('fs');
const readFileAsync = promisify(fs.readFile);

import * as types from '../types';

export default async (currentContext: types.IContextObject): Promise<types.IPackage> => {

    // First we try load the package.json where this command has been run
    try {
        const pkg = await readFileAsync(`${currentContext.workingDirectory}/package.json`, 'utf-8');
        const contents = JSON.parse(pkg);
        return contents;
    } catch (e) {
        // If no package file it found we want to exit early
        const error = new Error(`No valid ${'package.json'.yellow} found at ${currentContext.workingDirectory.yellow}`.bgRed.bold);
        throw error;
    }
};

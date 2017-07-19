import * as types from '../types';

import loadPackage from './load-package';
import loadRules from './load-rules';

export default async (currentContext: types.IContextObject): Promise<types.IContextObject> => {
    // First we try load the package.json where this command has been run
    try {
        const pkg = await loadPackage(currentContext);

        const packageContext: types.IContextObject = {
            package: pkg,
            ...currentContext
        };
        // console.log(packageContext);

        const npmLint = await loadRules(packageContext);

        const context: types.IContextObject = {
            ...packageContext,
            ...npmLint
        };
        // console.log(context);

        // Now we need to add name and version to always be checked in properties
        if (!context.rules.properties.required) {
            context.rules.properties.required = ['name', 'version'];
        } else {
            if (!context.rules.properties.required.includes('name')) {
                context.rules.properties.required.push('name');
            }
            if (!context.rules.properties.required.includes('version')) {
                context.rules.properties.required.push('version');
            }
        }

        return context;
    } catch (e) {
        // If no package file it found we want to exit early
        // const error = new Error(`No valid ${'package.json'.yellow} found at ${currentContext.workingDirectory.yellow}`.bgRed.bold);
        // throw error;

        throw e;
    }
};

import * as constants from './constants';
import * as types from './types';

let exitCode = constants.ExitCodes.OK;

process.on('unhandledRejection', (err: Error) => {
    /*tslint:disable */
    console.log(err.stack);
    process.exit(constants.ExitCodes.ERROR);
    /*tslint:enable */
});

process.on('uncaughtException', (exception: Error) => {
    /*tslint:disable */
    console.log(exception.stack); // to see your exception details in the console
    process.exit(constants.ExitCodes.ERROR);
    /*tslint:enable */
});

import 'colors';

import { argv } from 'yargs';

import * as loki from 'lokijs';
import * as Table from 'cli-table';
import * as winston from 'winston';

import createContext from './lib/create-context';

const finalResults = new loki('npm-lint.json');

const dataObj = {
    workingDirectory: process.cwd(),
    important: finalResults.addCollection('important', {
        disableChangesApi: false
    }),
    info: finalResults.addCollection('info', {
        disableChangesApi: false
    }),
    errors: finalResults.addCollection('errors', { disableChangesApi: false }),
    warnings: finalResults.addCollection('warnings', {
        disableChangesApi: false
    })
};

if (argv.debug) {
    dataObj.info.on('insert', (result: Error) => {
        winston.info(`Info: ${result.message}`.gray);
    });
}

dataObj.errors.on('insert', (result: Error) => {
    // On the first error we always trigger a change in exit code
    if (!exitCode) {
        exitCode = constants.ExitCodes.ERROR;
    }
    winston.error(`${result.message}`.red);
});

dataObj.warnings.on('insert', (result: Error) => {
    winston.warn(`Warning: ${result.message}`.yellow);
});

dataObj.important.on('insert', (result: Error) => {
    winston.info(`${result.message}`.cyan);
});

dataObj.important.insert({
    message: `${`Running npm-linter`.green}`.underline.bgBlue
});

const init = async () => {
    let context;
    try {
        context = await createContext(dataObj);
    } catch (e) {
        dataObj.errors.insert({ message: e.message });
        process.exit(1);
    }

    context.info.insert({
        message: `Using Rules: `.bold + `${Object.keys(context.rules).join(', ')}`
    });
    return context;
};

const run = async (context: types.IContextObject) => {
    await Object.keys(context.rules).forEach(async (ruleKey: string) => {
        let rules;
        try {
            rules = require(`./../rules/${ruleKey}`).default;
        } catch (e) {
            context.errors.insert({ message: e.message });
        }
        if (!rules) {
            return;
        }
        context.info.insert({ message: `Running ${rules.name}` });
        try {
            await rules.processor(context);
        } catch (e) {
            context.errors.insert({ message: e.message });
        }
    });
};

init().then(async (context: any) => {
    run(context).then(async () => {
        const table = new Table();

        table.push({ 'Total Errors': context.errors.count() }, { 'Total Warnings': context.warnings.count() });

        /*tslint:disable */
        console.log(table.toString());
        /*tslint:enable */

        if (context.rules.dependencies.checkLatest) {
            context.important.insert({
                message: `Doing dependency version check`.green
            });
            const scanner = require('./../scans/dependency_version_check');

            let upgrades;
            try {
                upgrades = await scanner.processor(context);
                if (upgrades.totalDependencies + upgrades.totalDevDependencies > 0) {
                    const dependencyTable = new Table({
                        head: ['Package', 'Type', 'Package Version', 'Latest Version'],
                        colWidths: [30, 18, 18, 18]
                    });

                    upgrades.results.dependencies.forEach((dependency: {package; type; currentVersion; upgrade}) => {
                        dependencyTable.push([dependency.package, dependency.type, dependency.currentVersion, dependency.upgrade]);
                    });
                    upgrades.results.devDependencies.forEach((dependency: {package; type; currentVersion; upgrade}) => {
                        dependencyTable.push([dependency.package, dependency.type, dependency.currentVersion, dependency.upgrade]);
                    });
                    context.important.insert({
                        message: `Available Dependency Updates`.underline.cyan
                    });
                    /*tslint:disable */
                    console.log(dependencyTable.toString());
                    /*tslint:enable */
                } else {
                    context.important.insert({
                        message: `All dependencies are up to date`.green
                    });
                }
            } catch (e) {
                context.errors.insert({ message: e.message });
            }
        }

        // We've reached the end!
        if (!exitCode) {
            context.important.insert({
                message: 'npm-lint: No issues found'.green.bold
            });
        }
        process.exit(exitCode);
    });
});

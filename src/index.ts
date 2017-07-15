import * as constants from './constants';
import * as types from './types';

let exitCode = 0;

process.on('unhandledRejection', (err: Error) => {
    /*tslint:disable */
    console.log(err.stack);
    process.exit(1);
    /*tslint:enable */
});

process.on('uncaughtException', (exception: Error) => {
    /*tslint:disable */
    console.log(exception.stack); // to see your exception details in the console
    process.exit(1);
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
    constants,
    types,
    argv,
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
        exitCode = 1;
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

init().then(async (context) => {
    run(context).then(async () => {
        const table = new Table();

        table.push({ 'Total Errors': context.errors.count() }, { 'Total Warnings': context.warnings.count() });

        winston.log(table.toString());

        if (context.rules.dependencies.checkLatest) {
            context.important.insert({
                message: `Doing dependency version check`.green
            });
            const scanner = require('./../scans/dependency_version_check');

            let upgrades;
            try {
                upgrades = await scanner.processor(context);
                if (upgrades.upgrades && Object.keys(upgrades.upgrades).length > 0) {
                    const dependencyTable = new Table({
                        head: ['Package', 'Type', 'Package Version', 'Latest Version'],
                        colWidths: [40, 30, 30, 30]
                    });
                    Object.keys(upgrades.upgrades).forEach((upgrade) => {
                        let dep;
                        let type = 'dependency';
                        if (context.package.dependencies[upgrade]) {
                            dep = context.package.dependencies[upgrade];
                        } else if (context.package.devDependencies[upgrade]) {
                            dep = context.package.devDependencies[upgrade];
                            type = 'devDependency';
                        }

                        dependencyTable.push([upgrade, type, dep, upgrades.upgrades[upgrade]]);
                    });
                    context.important.insert({
                        message: `Available Dependency Updates`.underline.cyan
                    });
                    winston.log(table.toString());
                } else {
                    context.important.insert({
                        message: `All dependencies are up to date`.green
                    });
                }
            } catch (e) {
                context.errors.insert({ message: e.message });
            }
        }

        if (!exitCode) {
            context.important.insert({
                message: 'npm-lint: No issues found'.green.bold
            });
        }

        process.exit(exitCode);
    });
});

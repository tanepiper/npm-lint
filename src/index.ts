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
import createContext from './lib/create-context';

const finalResults = new loki('npm-lint.json');

const init = async (): Promise<types.IContextObject> => {
    let context: types.IContextObject = {
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
        context.info.on('insert', (result: Error) => {
            /*tslint:disable */
            console.log(`Info: ${result.message}`.gray);
            /*tslint:enable */
        });
    }

    context.errors.on('insert', (result: Error) => {
        // On the first error we always trigger a change in exit code
        if (!exitCode) {
            exitCode = constants.ExitCodes.ERROR;
        }
        /*tslint:disable */
        console.log(`Error: ${result.message}`.red);
        /*tslint:enable */
    });

    context.warnings.on('insert', (result: Error) => {
        /*tslint:disable */
        console.log(`Warning: ${result.message}`.yellow);
        /*tslint:enable */
    });

    context.important.on('insert', (result: Error) => {
        /*tslint:disable */
        console.log(`${result.message}`.cyan);
        /*tslint:enable */
    });

    context.important.insert({
        message: `${`Running npm-linter`.green}`.underline.bgBlue
    });
    try {
        context = await createContext(context);
        context.info.insert({
            message: `Using Rules: `.bold + `${Object.keys(context.rules).join(', ')}`
        });
    } catch (e) {
        context.errors.insert({ message: e.message });
        process.exit(constants.ExitCodes.ERROR);
    }
    return context;
};

const run = async (context: types.IContextObject) => {
    await Object.keys(context.rules).forEach(async (ruleKey: string) => {
        let rules;
        try {
            rules = require(`./../rules/${ruleKey}`).default;
            if (!rules) {
                return;
            }
            context.info.insert({ message: `Running ${rules.name}` });
            try {
                await rules.processor(context);
            } catch (e) {
                context.errors.insert({ message: e.message });
            }
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

        if (context.rules.dependencies && context.rules.dependencies.checkLatest) {
            context.important.insert({
                message: `Doing dependency version check`.green
            });
            const scanner = require('./../scans/dependency_version_check').default;

            try {
                await scanner.processor(context);
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

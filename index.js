#!/usr/bin/env node

let exitCode = 0;

const colors = require('colors');
console.log(`Running package-linter`.green);

const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const Table = require('cli-table');
const cwd = process.cwd();

const readFileAsync = promisify(fs.readFile);
const readDirAsync = promisify(fs.readdir);

const checkFiles = require(`${__dirname}/lib/check-files`);
const loadRule = require(`${__dirname}/lib/load-rule`);
const loadScan = require(`${__dirname}/lib/load-scan`);

// Check special rules first
let errors = [];
const rules = {};

checkFiles(cwd)
    .then(context => {
        // We load out rules via sync
        Object.keys(context.projectRules).forEach(key => {
            rules[key] = loadRule(key, __dirname);
        });

        const rulesReports = Object.keys(rules).map(ruleKey => {
            const rule = rules[ruleKey];
            return rule.processor(context, context.projectRules[rule.key]);
        });

        const results = Promise.all(rulesReports);

        results
            .then(results => {
                results.forEach(result => {
                    console.log(`${result.name}`.underline);
                    if (!result.errors || (result.errors && result.errors.length === 0)) {
                        return console.log(`No Errors`.green);
                    }
                    result.errors.forEach(error => {
                        console.error(`${error.message}`.red.bold);
                    });
                });
                return Promise.resolve(null);
            })
            .then(() => {
                if (context.projectRules.dependencies.checkLatest) {
                    const scanner = loadScan('dependency_version_check', __dirname);

                    const result = scanner.processor(context);
                    result.then(results => {
                        results.result.then(upgrades => {
                            if (upgrades.upgrades && Object.keys(upgrades.upgrades).length > 0) {
                                const table = new Table({
                                    head: ['Package', 'Package Version', 'Latest Version'],
                                    colWidths: [40, 30, 30]
                                });

                                Object.keys(upgrades.upgrades).forEach(upgrade => {
                                    table.push([upgrade, context.package.dependencies[upgrade], upgrades.upgrades[upgrade]]);
                                });
                                console.log(`Available Dependency Updates`.underline.cyan);
                                console.log(table.toString());
                            } else {
                                console.log('All dependencies are up to date'.underline.green.bold);
                            }
                        });
                    });
                }
            });
    })
    .catch(error => {
        console.log(error);
        process.exit(1);
    });

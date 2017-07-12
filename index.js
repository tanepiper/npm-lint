#!/usr/bin/env node

let exitCode = 0;

require('colors');
console.log(`Running package-linter`.green);

const Table = require('cli-table');
const cwd = process.cwd();

const checkFiles = require(`${__dirname}/lib/check-files`);
const loadRule = require(`${__dirname}/lib/load-rule`);
const loadScan = require(`${__dirname}/lib/load-scan`);

checkFiles(cwd)
    .then(context => {
        const rules = {};
        
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
                    exitCode = 1;
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
                                    head: ['Package', 'Type', 'Package Version', 'Latest Version'],
                                    colWidths: [40, 30, 30, 30]
                                });

                                Object.keys(upgrades.upgrades).forEach(upgrade => {
                                    let dep;
                                    let type = 'dependency';
                                    if (context.package.dependencies[upgrade]) {
                                        dep = context.package.dependencies[upgrade];
                                    } else if (context.package.devDependencies[upgrade]) {
                                        dep = context.package.devDependencies[upgrade];
                                        type = 'devDependency';
                                    }

                                    table.push([upgrade, type, dep, upgrades.upgrades[upgrade]]);
                                });
                                console.log(`Available Dependency Updates`.underline.cyan);
                                console.log(table.toString());
                            } else {
                                console.log('All dependencies are up to date'.underline.green.bold);
                            }
                            process.exit(exitCode);
                        });
                    });
                }
            });
    })
    .catch(error => {
        console.log(error);
        process.exit(1);
    });

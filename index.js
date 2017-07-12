#!/usr/bin/env node

let exitCode = 0;

const colors = require('colors');
console.log(`Running package-linter`.green);

const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();

const readFileAsync = promisify(fs.readFile);
const readDirAsync = promisify(fs.readdir);

const checkFiles = require(`${__dirname}/lib/check-files`);
const loadRule = require(`${__dirname}/lib/load-rule`);

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
        
        results.then((results)=> {
            results.forEach(result => {
                console.log(`${result.name}`.underline);
                if (!result.errors || result.errors && result.errors.length === 0) {
                    return console.log(`No Errors`.green);
                }
                result.errors.forEach(error => {
                    console.error(`${error.message}`.red.bold);
                })

            })
        });

        // const errorsGroups = rulesToRun.map(rule => {
        //     return rule.module.processor(context, context.projectRules[rule.key]);
        // }).filter(error => error);

        // Promise.all(errorsGroups).then(() => {
        //     console.log(arguments);

        // //     .then(resolved => {
        // //     resolved.forEach(display => {
        // //         if (display.name === 'latest') {
        // //             const table = new Table({
        // //                 head: ['Package', 'Package Version', 'Latest Version'],
        // //                 colWidths: [40, 30, 30]
        // //             });

        // //             Object.keys(display.upgrades).forEach(dep => {
        // //                 table.push([dep, context.package.dependencies[dep], display.upgrades[dep]]);
        // //             });
        // //             console.log(table.toString());
        // //         }
        // //     });
        // // });
        // });

        // errorsGroups.forEach(errorGroup => {
        //     if (errorGroup.errors) {
        //         errorGroup.errors.forEach(error => {

        //             // If we have an error, and the exit code isn't set, then set it to 1
        //             if (error.level === 'error' && !exitCode) {
        //                 exitCode = 1;
        //             }

        //             const colours = {
        //                 'error': 'red'
        //             }

        //             console[error.level](error.message[colours[error.level]]);
        //         });
        //     }
        // });

        // if (!exitCode) {
        //     console.log(`Your NPM file is all good`.bold.yellow + `\x20\u2713`.green);
        // }
        // process.exit(exitCode);
    })
    .catch(error => {
        console.log(error);
        process.exit(1);
    });

// fs.readdir(`${__dirname}/rules`, (err, ruleFiles) => {
//     Object.keys(defaultRules).forEach(rule => {
//         if (ruleFiles.includes(`${rule}.js`)) {
//             const ruleFileIndex = ruleFiles.indexOf(`${rule}.js`);
//             try {
//                 const script = require(`${__dirname}/rules/${ruleFiles[
//                     ruleFileIndex
//                 ]}`);
//                 rules[script.key] = script;
//             } catch (e) {
//                 console.log(`Unable to load rule ${rule}`);
//             }
//         }
//     });

//     Object.keys(rules).forEach(ruleKey => {
//         console.log(`Running rule ${ruleKey}`);
//         const rule = rules[ruleKey];
//         const ruleErrors = rule.processor(package, defaultRules[ruleKey]);
//         errors = errors.concat(ruleErrors);
//     });

//     let exitCode = 0;

//     if (errors.length > 0) {
//         exitCode = 1;
//         errors.forEach(error => {
//             console.error(`Rule: ${error}`);
//         });
//     } else {
//         console.log('Your NPM file is all good');
//     }

//     process.exit(exitCode);
// });

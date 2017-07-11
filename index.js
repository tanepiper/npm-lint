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
    .then(result => {
        const { package, projectRules } = result;

        //console.log('Package', package);
        //console.log('Project Rules', projectRules);

        const rulesToRun = Object.keys(projectRules).map(key => {
            return {
                key,
                module: loadRule(key, __dirname)
            }
        });
        
        const errorsGroups = rulesToRun.map(rule => {
            return rule.module.processor(package, projectRules[rule.key]);
        }).filter(error => error);

        errorsGroups.forEach(errorGroup => {
            errorGroup.errors.forEach(error => {

                // If we have an error, and the exit code isn't set, then set it to 1
                if (error.level === 'error' && !exitCode) {
                    exitCode = 1;
                }

                console[error.level](error.message);
            });
        });

        if (!exitCode) {
            console.log(`Your NPM file is all good`.bold.yellow + `\x20\u2713`.green);
        }
        process.exit(exitCode);
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

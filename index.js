#!/usr/bin/env node

const package = require('./package.json');
const lintingRules = require('./.npmlint.json');
const fs = require('fs');

// Check special rules first
let errors = [];
const rules = {};

fs.readdir(`${__dirname}/rules`, (err, ruleFiles) => {
    Object.keys(lintingRules).forEach(rule => {
        if (ruleFiles.includes(`${rule}.js`)) {
            const ruleFileIndex = ruleFiles.indexOf(`${rule}.js`);
            try {
                const script = require(`${__dirname}/rules/${ruleFiles[
                    ruleFileIndex
                ]}`);
                rules[script.key] = script;
            } catch (e) {
                console.log(`Unable to load rule ${rule}`);
            }
        }
    });

    Object.keys(rules).forEach(ruleKey => {
        console.log(`Running rule ${ruleKey}`)
        const rule = rules[ruleKey];
        const ruleErrors = rule.processor(package, lintingRules[ruleKey]);
        errors = errors.concat(ruleErrors);
    });

    let exitCode = 0;

    if (errors.length > 0) {
        exitCode = 1;
        errors.forEach(error => {
            console.error(`Rule: ${error}`);
        });
    } else {
        console.log('Your NPM file is all good');
    }

    process.exit(exitCode);
});

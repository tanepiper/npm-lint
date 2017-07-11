#!/usr/bin/env node

const package = require('./package.json');

const lintingRules = require('./.npmlint.json');

// Check special rules first
const errors = [];

if (!package.name) {
    errors.push("Package must include name");
}
if (!package.version) {
    errors.push("Package must include version");
}

lintingRules.include.forEach((include, index) => {
    if (!package[include]) {
        errors.push(`Package must include ${include}`);
    }
});

if (lintingRules.scripts && lintingRules.scripts.allow && lintingRules.scripts.allow.length > 0) {

    Object.keys(package.scripts).map((scriptName) => {
        const script = package.scripts[scriptName];
        // Find all executables called in this script
        const scriptParts = script.split('&&').map(item => item.trim().split(' '));
        scriptParts.forEach(scriptPart => {
            if (!lintingRules.scripts.allow.includes(scriptPart[0])) {
                 errors.push(`Script ${scriptName} has a unknown executable ${scriptPart[0]}`);
            }
        });
    });
}

const exitCode = errors.length > 0 ? 1 : 0;

errors.forEach((error) => {
    console.error(`Rule: ${error}`);
});

process.exit(exitCode);
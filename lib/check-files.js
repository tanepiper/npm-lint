const defaultNpmLint = require(`${__dirname}/../default/.npmlint.json`);

module.exports = cwd => {
    return new Promise((resolve, reject) => {
        const result = {};

        // First we try load the package.json where this command has been run
        let pkg;
        try {
            pkg = require(`${cwd}/package.json`);
        } catch (e) {
            return reject(new Error(`No package.json found at ${cwd}`));
        }
        result.package = pkg;
        result.packageFile = `${cwd}/package.json`;


        let npmLint;
        try {
            npmLint = require(`${cwd}/.npmlint.json`);
        } catch (e) {
            console.error(`No .npmlint.json found at ${cwd}, using defaults`.bold);
        }
        if (npmLint) {
            result.options = npmLint.options || {};
            result.rules = npmLint.rules || {};
            result.npmLintFile = `${cwd}/.npmlint.json`;
        } else {
            result.options = defaultNpmLint.options || {};
            result.rules = defaultNpmLint.rules || {};
            result.npmLintFile = `${__dirname}/../default/.npmlint.json`;
        }

        // Now we need to add name and version to always be checked in properties
        if (!result.rules.properties) {
            result.rules.properties = ['name', 'version'];
        } else {
            if (!result.rules.properties.includes('name')) {
                result.rules.properties.push('name');
            }
            if (!result.rules.properties.includes('version')) {
                result.rules.properties.push('version');
            }
        }

        return resolve(result);
    });
};

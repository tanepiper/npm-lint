const defaultRules = require(`${__dirname}/../default/.npmlint.json`);

module.exports = cwd => {
    return new Promise((resolve, reject) => {
        const result = {};

        // First we try load the package.json where this command has been run
        let package;
        try {
            package = require(`${cwd}/package.json`);
        } catch (e) {
            return reject(new Error(`No package.json found at ${cwd}`));
        }
        result.package = package;
        result.packageFile = `${cwd}/package.json`;

        let projectRules;
        try {
            projectRules = require(`${cwd}/.npmlint.json`);
        } catch (e) {
            console.error(`No .npmlint.json found at ${cwd}, using defaults`.bold);
        }
        if (projectRules) {
            result.projectRules = projectRules;
            result.projectRulesFile = `${cwd}/.npmlint.json`;
        } else {
            result.projectRules = defaultRules;
            result.projectRulesFile = `${__dirname}/../default/.npmlint.json`;
        }

        // Now we need to add name and version to always be checked in properties
        if (!result.projectRules.properties) {
            result.projectRules.properties = ['name', 'version'];
        } else {
            if (!result.projectRules.properties.includes('name')) {
                result.projectRules.properties.push('name');
            }
            if (!result.projectRules.properties.includes('version')) {
                result.projectRules.properties.push('version');
            }
        }

        return resolve(result);
    });
};

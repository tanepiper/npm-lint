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
            result.projectRulesFile = `${cwd}/.npmlint.json`
        } else {
            result.projectRules = defaultRules;
            result.projectRulesFile = `${__dirname}/../default/.npmlint.json`
        }
        
        return resolve(result);
    });
};

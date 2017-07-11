const defaultRules = require(`${__dirname}/../default/.npmlint.json`);

module.exports = cwd => {
    return new Promise((resolve, reject) => {
        // First we try load the package.json where this command has been run
        let package;
        try {
            package = require(`${cwd}/package.json`);
        } catch (e) {
            return reject(new Error(`No package.json found at ${cwd}`));
        }

        let projectRules;
        try {
            projectRules = require(`${cwd}/.npmlint.json`);
        } catch (e) {
            console.error(`No .npmlint.json found at ${cwd}, using defaults`.bold);
        }
        if (!projectRules) {
            projectRules = defaultRules;
        }

        return resolve({ package, projectRules });
    });
};

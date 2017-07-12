const semverRegex = require('semver-regex');

module.exports = {
    name: 'Dependency Rule',
    key: 'dependencies',
    /**
     * Processor method
     * @param {Object} package The package.json as a JSON object
     * @param {Object} The rules for this plugin
     */
    processor: (context, rules) => {
        return Promise.resolve({
            name: module.exports.name,
            key: module.exports.key,
            errors: Object.keys(context.package.dependencies || {}).map(dependency => {
                if (!dependency) {
                    return;
                }

                const semverOrPath = context.package.dependencies[dependency];

                if (semverRegex().test(semverOrPath)) {
                    return;
                }

                const checkInAllowedList = rules.sources.find(rule => semverOrPath.includes(rule));
                if (!checkInAllowedList) {
                    return {
                        type: module.exports.name,
                        key: module.exports.key,
                        message: `package.json dependency "${dependency}" has a version or location that is now allowed "${semverOrPath}"`,
                        level: 'error'
                    }
                }
            }).concat(
                Object.keys(context.package.devDependencies || {}).map(dependency => {
                    if (!dependency)  {
                        return;
                    }
                    const semverOrPath = context.package.devDependencies[dependency];
                    if (semverRegex().test(semverOrPath)) {
                        return;
                    }
                    const checkInAllowedList = rules.sources.find(rule => semverOrPath.includes(rule));
                    if (!checkInAllowedList) {
                        return {
                            type: module.exports.name,
                            key: module.exports.key,
                            message: `package.json devDependencies "${dependency}" has a location that is now allowed "${semverOrPath}"`,
                            level: 'error'
                        }
                    }
                })
            )
            .filter(error => error)
        });
    }
};

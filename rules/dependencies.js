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
                const semverOrPath = context.package.dependencies[dependency];

                if (semverRegex().test(semverOrPath)) {
                    return;
                }

                const checkInAllowedList = rules.sources.find(rule => semverOrPath.includes(rule));
                if (!checkInAllowedList) {
                    return {
                        type: module.exports.name,
                        key: module.exports.key,
                        message: `package.json dependency "${dependency}" has a location that is now allowed "${semverOrPath}"`,
                        level: 'error'
                    }
                }
            }).concat(
                Object.keys(context.package.devDependencies || {}).map(dependency => {    
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

        //resolved

        // .then(...args => {
        //     console.log(...args);
        // });

        // if (rules.sources && rules.sources.length > 0) {
        //     const dependencyList = Object.keys(package.dependencies);
        //     const semverOrSourceList = dependencyList.map(
        //         dep => package.dependencies[dep]
        //     );

        //     const notNpmDependencies = dependencyList
        //         .map((dep, index) => {
        //             if (!semverRegex().test(semverOrSourceList[index])) {
        //                 return { dep, value: semverOrSourceList[index] };
        //             }
        //         })
        //         .filter(dep => dep);

        //     const brokenRules = rules.sources
        //         .map(sourceKey => {
        //             const dep = notNpmDependencies.find((d) => {
        //                 console.log(d, sourceKey);
        //                 return d.value.includes(sourceKey);
        //             });
        //             //console.log(dep);

        //             if (!dep) {
        //                 return `Not a valid source in package.json`;
        //             }
        //         })
        //         .filter(error => error)
        //         .reduce((prev, curr) => {
        //             return prev.concat(curr);
        //         }, []);

        //     return { dependencyList, brokenRules };
        // }
    }
};

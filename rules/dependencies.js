const semverRegex = require('semver-regex');
const ncu = require('npm-check-updates');
const Table = require('cli-table');

module.exports = {
    name: 'Dependency Rule',
    key: 'dependencies',
    /**
     * Processor method
     * @param {Object} package The package.json as a JSON object
     * @param {Object} The rules for this plugin
     */
    processor: (context, rules) => {
        const promisesToResolve = [];

        if (rules.checkLatest) {
            try {
                promisesToResolve.push(
                    ncu
                        .run({
                            packageData: JSON.stringify(context.package),
                            args: Object.keys(context.package.dependencies),
                            silent: false,
                            jsonUpgraded: true
                        })
                        .then(upgrades => {
                            return {
                                name: 'latest',
                                upgrades,
                                totalUpgrades:
                                    (upgrades &&
                                        Object.keys(upgrades).length) ||
                                    0
                            };
                        })
                );
            } catch (e) {
                return e;
            }
        }

        const resolved = Promise.all(promisesToResolve);

        return resolved;
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

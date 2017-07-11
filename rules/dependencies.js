const semverRegex = require('semver-regex');

module.exports = {
    name: 'Dependency Rule',
    key: 'dependencies',
    /**
     * Processor method
     * @param {Object} package The package.json as a JSON object
     * @param {Object} The rules for this plugin
     */
    processor: (package, rules) => {

        // if (rules.sources && Object.keys(rules.sources.length) > 0) {

        //     const dependencyList = Object.keys(package.dependencies);
        //     const semverOrSourceList = dependencyList.map(dep => package.dependencies[dep]);

        //     const brokenRules = Object.keys(rules.sources).map(sourceKey => {
        //         const sourceRule = rules.sources[sourceKey];
        //         let 
        //         if (Array.isArray(sourceRule)) {

        //         }

        //         if (!source.includes(sourceOrSemver)) {
        //             return `Not a valid source ${sourceOrSemver}`;
        //         }
        //     }).filter(error => error).reduce((prev, curr) => {
        //         return prev.concat(curr);
        //     }, []);

        //     return { dependencyList, brokenRules };

        //     // const dependencySources = Object.keys(package.dependencies).map(dependencyName => {
        //     //     const sourceOrSemver = package.dependencies[dependencyName];

        //     //     if (!semverRegex().test(sourceOrSemver)) {
        //     //         return rules.sources.map(source => {
        //     //             if (!source.includes(sourceOrSemver)) {
        //     //                 return `Not a valid source ${sourceOrSemver}`;
        //     //             }
        //     //         }).filter(error => error);
        //     //     }
        //     // }).filter(error => error).reduce((prev, curr) => {
        //     //     return prev.concat(curr);
        //     // }, []);

        //     // return dependencySources;
        // }
    }
}
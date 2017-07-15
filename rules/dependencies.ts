import * as semver from 'semver';
import * as types from '../src/types';

import getValidSemver from '../src/lib/get-valid-semver';

export default {
    name: 'Dependency Rule',
    key: 'dependencies',
    /**
     * Processor method
     * @param {Object} package The package.json as a JSON object
     * @param {Object} The rules for this plugin
     */
    processor: (context: types.IContextObject): void => {
        const rules: types.IDependencyRules = context.rules[module.exports.key] || {};
        if (!context.package.dependencies) {
            context.warnings.insert({
                message: `${'package.json'.yellow} does not contain dependencies property but it is present in ${'.npmlint.json'.yellow}`
            });
        }

        const dependencies: object = context.package.dependencies || {};
        const devDependencies: object = context.package.devDependencies || {};

        const dependencyKeys: string[] = Object.keys(dependencies);
        const devDependencyKeys: string[] = Object.keys(devDependencies);

        const allDependencies: string[] = dependencyKeys.concat(devDependencyKeys);
        const allValues: string[] = dependencyKeys.map((key: string) => dependencies[key]).concat(devDependencyKeys.map((key: string) => devDependencies[key]));

        allDependencies.forEach((dependency: string) => {
            if (!dependency) {
                context.errors.insert({
                    message: `${'package.json'.yellow} contains a blank dependency name`
                });
            }

            const valueIndex: number = allDependencies.indexOf(dependency);
            const semverOrPath: string = allValues[valueIndex];

            // Check we have a semver range, and grab the package version value
            // Regexp from https://github.com/sindresorhus/semver-regex
            const validSemver: string | null = getValidSemver(semverOrPath);
            if (validSemver && semver.valid(validSemver)) {
                return;
            }

            // Allow the use of latest in dependency semver
            if (rules.allowLatest && rules.allowLatest === true && semverOrPath === 'latest') {
                return;
            }

            const checkInAllowedList = (rules.sources || []).find((rule: string) => semverOrPath.includes(rule));
            if (!checkInAllowedList) {
                context.errors.insert({
                    message: `${'package.json'.yellow} dependency "${dependency.blue}" has a version or location that is not allowed "${semverOrPath.red}"`
                });
            }
        });
    }
};

import * as semver from 'semver';

export default {
    name: 'Dependency Rule',
    key: 'dependencies',
    /**
     * Processor method
     * @param {Object} package The package.json as a JSON object
     * @param {Object} The rules for this plugin
     */
    processor: (context: any) => {
        const rules: { allowLatest: boolean; checkLatest: boolean; sources: string[] } = context.rules[module.exports.key] || {};
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
        const allValues: string[] = dependencyKeys
            .map((key: string) => dependencies[key])
            .concat(devDependencyKeys.map((key: string) => devDependencies[key]));

        allDependencies.forEach((dependency: string) => {
            if (!dependency) {
                context.errors.insert({
                    message: `${'package.json'.yellow} contains a blank dependency name`
                });
            }

            const valueIndex: number = allDependencies.indexOf(dependency);
            const semverOrPath: string = allValues[valueIndex];

            // Check we have a semver range, and grab the package version value
            const isSemver: RegExpMatchArray | null = semverOrPath.match(/^[\^|\~](\d+\.\d+\.\d+)$/);
            if (isSemver && semver.valid(isSemver[1])) {
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

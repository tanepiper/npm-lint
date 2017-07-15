import * as ncu from 'npm-check-updates';
import * as types from '../src/types';

module.exports = {
    name: 'Dependency Version Check',
    key: 'dependency_version_check',
    processor: async (context: types.IContextObject) => {

        let allPackages: string[] = context.package.dependencies && Object.keys(context.package.dependencies || {});
        if (context.package.devDependencies) {
            allPackages = allPackages.concat(Object.keys(context.package.devDependencies || {}));
        }

        let result: { upgrades; totalUpgrades };
        try {
            result = await ncu
                .run({
                    packageData: JSON.stringify(context.package),
                    args: allPackages,
                    silent: true,
                    jsonUpgraded: true
                })
                .then((upgrades: object) => {

                    const results = Object.keys(upgrades).reduce((output: {dependencies: object[], devDependencies: object[]}, pkg: string): any => {
                        if (context.package.dependencies[pkg]) {
                            output.dependencies.push({
                                package: pkg,
                                currentVersion: context.package.dependencies[pkg],
                                upgrade: upgrades[pkg],
                                type: 'dependencies'
                            });
                        } else if (context.package.devDependencies[pkg]) {
                            output.dependencies.push({
                                package: pkg,
                                currentVersion: context.package.devDependencies[pkg],
                                upgrade: upgrades[pkg],
                                type: 'devDependencies'
                            });
                        }
                        return output;
                    }, {dependencies: [], devDependencies: []});
                    return {
                        results,
                        totalDependencies: results.dependencies && results.dependencies.length || 0,
                        totalDevDependencies: results.dependencies && results.devDependencies.length || 0
                    };
                });
            return result;
        } catch (e) {
            context.errors.insert({ message: e.message });
        }
    }
};

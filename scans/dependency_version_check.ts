import * as ncu from 'npm-check-updates';
import * as types from '../src/types';

import * as Table from 'cli-table';

module.exports = {
    name: 'Dependency Version Check',
    key: 'dependency_version_check',
    processor: async (context: types.IContextObject): Promise<void> => {

        const pkg: types.IPackage = context.package || { name: '', version: '', dependencies: {}, devDependencies: {} };

        // No dependency check if we don't have anything to check
        if (Object.keys(pkg.dependencies).length === 0 && Object.keys(pkg.devDependencies)) {
            return;
        }

        let allPackages: string[] = Object.keys(pkg.dependencies || {});
        if (pkg.devDependencies) {
            allPackages = allPackages.concat(Object.keys(pkg.devDependencies || []));
        }

        try {
            await ncu
                .run({
                    packageData: JSON.stringify(pkg),
                    args: allPackages,
                    silent: true,
                    jsonUpgraded: true
                })
                .then((upgrades: object) => {
                    const packages = Object.keys(upgrades).reduce(
                        (output: { dependencies: object[]; devDependencies: object[] }, upgrade: string): any => {
                            if (pkg.dependencies[upgrade]) {
                                output.dependencies.push({
                                    package: upgrade,
                                    currentVersion: pkg.dependencies[upgrade],
                                    upgrade: upgrades[upgrade],
                                    type: 'dependencies'
                                });
                            } else if (pkg.devDependencies[upgrade]) {
                                output.dependencies.push({
                                    package: upgrade,
                                    currentVersion: pkg.devDependencies[upgrade],
                                    upgrade: upgrades[upgrade],
                                    type: 'devDependencies'
                                });
                            }
                            return output;
                        },
                        { dependencies: [], devDependencies: [] }
                    );

                    const results: { totalDependencies; totalDevDependencies; packages } = {
                        packages,
                        totalDependencies: (packages.dependencies && packages.dependencies.length) || 0,
                        totalDevDependencies: (packages.dependencies && packages.devDependencies.length) || 0
                    };

                    if (results.totalDependencies + results.totalDevDependencies > 0) {
                        const dependencyTable: Table = new Table({
                            head: ['Package', 'Type', 'Local Version', 'Remote Version'],
                            colWidths: [30, 18, 18, 18]
                        });

                        results.packages.dependencies.forEach((dependency: { package; type; currentVersion; upgrade }) => {
                            dependencyTable.push([dependency.package, dependency.type, dependency.currentVersion, dependency.upgrade]);
                        });
                        results.packages.devDependencies.forEach((dependency: { package; type; currentVersion; upgrade }) => {
                            dependencyTable.push([dependency.package, dependency.type, dependency.currentVersion, dependency.upgrade]);
                        });
                        context.important.insert({
                            message: `Available Dependency Updates`.underline.cyan
                        });
                        /*tslint:disable */
                        console.log(dependencyTable.toString());
                        /*tslint:enable */
                    } else {
                        context.important.insert({
                            message: `All dependencies are up to date`.green
                        });
                    }
                });
        } catch (e) {
            context.errors.insert({ message: e.message });
        }
    }
};

import * as types from '../src/types';

import fetchPackages from '../src/lib/fetch-packages';
import getValidSemver from '../src/lib/get-valid-semver';

import * as semver from 'semver';
import Table = require('cli-table');

export default {
    name: 'Dependency Version Check',
    key: 'dependency_version_check',
    processor: async (context: types.IContextObject): Promise<any> => {
        const pkg: types.IPackage = context.package || { name: '', version: '', dependencies: {}, devDependencies: {} };

        if (Object.keys(pkg.dependencies).length === 0 && Object.keys(pkg.devDependencies)) {
            return;
        }

        let allPackages: string[] = Object.keys(pkg.dependencies || {})
            .map(key => {
                if (getValidSemver(pkg.dependencies[key])) {
                    return key;
                }
                return null;
            })
            .filter(f => f);
        if (pkg.devDependencies) {
            allPackages = allPackages.concat(
                Object.keys(pkg.devDependencies || {})
                    .map(key => {
                        if (getValidSemver(pkg.devDependencies[key])) {
                            return key;
                        }
                        return null;
                    })
                    .filter(f => f)
            );
        }

        try {
            const pkgs = await fetchPackages(context, allPackages);
            const dependencyTable = new Table({
                head: ['Package', 'Type', 'Local Version', 'Remote Version'],
                colWidths: [30, 18, 18, 18]
            });
            let totalUpdates = 0;
            pkgs.forEach(potentialUpdate => {
                let type = 'dependency'.cyan;
                let existingSemver = getValidSemver(pkg.dependencies[potentialUpdate.name]);
                if (!existingSemver) {
                    existingSemver = getValidSemver(pkg.devDependencies[potentialUpdate.name]);
                    type = 'devDependency'.magenta;
                }
                if (!existingSemver) {
                    return;
                }
                if (semver.gt(potentialUpdate.version, existingSemver)) {
                    totalUpdates = totalUpdates + 1;
                    dependencyTable.push([`${potentialUpdate.name}`.yellow.bold, type, `${existingSemver}`.grey, `${potentialUpdate.version}`.green]);
                }
            });

            if (totalUpdates === 0) {
                context.important.insert({
                    message: `All dependencies are up to date`.green
                });
            } else {
                context.important.insert({
                    message: `Available Dependency Updates`.underline.cyan
                });
                /*tslint:disable */
                console.log(dependencyTable.toString());
                /*tslint:enable */
            }
        } catch (e) {
            context.errors.insert({ message: e.message });
        }
    }
};

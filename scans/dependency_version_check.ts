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
                .then((upgrades: any) => {
                    return {
                        upgrades,
                        totalUpgrades: (upgrades && Object.keys(upgrades).length) || 0
                    };
                });
            return result;
        } catch (e) {
            context.errors.insert({ message: e.message });
        }
    }
};

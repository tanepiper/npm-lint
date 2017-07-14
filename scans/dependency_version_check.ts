const ncu = require('npm-check-updates');

module.exports = {
    name: 'Dependency Version Check',
    key: 'dependency_version_check',
    processor: async (context:any) => {
        let allPackages = context.package.dependencies && Object.keys(context.package.dependencies);
        if (context.package.devDependencies) {
            allPackages = allPackages.concat(Object.keys(context.package.devDependencies));
        }

        let result;
        try {
            result = await ncu
                .run({
                    packageData: JSON.stringify(context.package),
                    args: allPackages,
                    silent: true,
                    jsonUpgraded: true
                })
                .then((upgrades:any) => {
                    return {
                        upgrades,
                        totalUpgrades: (upgrades && Object.keys(upgrades).length) || 0
                    };
                });
        } catch (e) {
            context.errors.insert({ message: e.message });
        }
        return result;
    }
};

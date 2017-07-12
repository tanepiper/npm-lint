const ncu = require('npm-check-updates');

module.exports = {
    name: 'Dependency Version Check',
    key: 'dependency_version_check',
    processor: context => {

        let allPackages = context.package.dependencies && Object.keys(context.package.dependencies)
        if (context.package.devDependencies) {
            allPackages = allPackages.concat(Object.keys(context.package.devDependencies));
        }
        return Promise.resolve({
            name: module.exports.name,
            key: module.exports.key,
            result: ncu
                .run({
                    packageData: JSON.stringify(context.package),
                    args: allPackages,
                    silent: true,
                    jsonUpgraded: true
                })
                .then(upgrades => {
                    return {
                        upgrades,
                        totalUpgrades: (upgrades && Object.keys(upgrades).length) || 0
                    };
                })
            
        });
    }
};
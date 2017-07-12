const ncu = require('npm-check-updates');

module.exports = {
    name: 'Dependency Version Check',
    key: 'dependency_version_check',
    processor: context => {
        return Promise.resolve({
            name: module.exports.name,
            key: module.exports.key,
            result: ncu
                .run({
                    packageData: JSON.stringify(context.package),
                    args: Object.keys(context.package.dependencies),
                    silent: false,
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
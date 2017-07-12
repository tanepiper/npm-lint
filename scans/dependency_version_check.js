module.exports = {
    name: 'Dependency Version Check',
    key: 'dependency_version_check',
    processor: (context) => {
        
    }
}


//  if (rules.checkLatest) {
//                 try {
//                     promisesToResolve.push(
//                         ncu
//                             .run({
//                                 packageData: JSON.stringify(context.package),
//                                 args: Object.keys(context.package.dependencies),
//                                 silent: false,
//                                 jsonUpgraded: true
//                             })
//                             .then(upgrades => {
//                                 return {
//                                     name: 'latest',
//                                     upgrades,
//                                     totalUpgrades: (upgrades && Object.keys(upgrades).length) || 0
//                                 };
//                             })
//                     );
//                 } catch (e) {
//                     return e;
//                 }
//             }

//             const resolved = Promise.all(promisesToResolve);

//             resolve(resolved);
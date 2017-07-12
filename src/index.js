let exitCode = 0;

require('colors');
console.log(`Running npm-linter`.green.underline);

const loki = require('lokijs');

const Table = require('cli-table');
const cwd = process.cwd();

const createContext = require('./lib/create-context');
const loadRule = require('./lib/load-rule');
const loadScan = require('./lib/load-scan');

const init = async function init() {
  let context;
  try {
    context = await createContext(cwd);
  } catch (e) {
    return e;
  }

  const allRules = {};
  Object.keys(context.rules).forEach(key => {
    allRules[key] = loadRule(key, __dirname);
  });

  console.log(`Using Rules: `.bold + `${Object.keys(allRules).join(', ')}`);

  const result = await Object.keys(allRules).map(async key => {
    const rules = allRules[key];
    let errors;
    try {
      errors = await rules.processor(context, context.rules[key]);
    } catch (e) {
      return e;
    }
    return { key, rules, errors };
  });

  return result;
};

init().then(async results => {
    await results.forEach(async result => {
        await result.then(info => {
            console.log(`${info.errors.name}`.blue.underline + ` [Total issues: ${'' + info.errors.errors.length + ''.yellow}]`.bold);
            if (info.errors.errors.length > 0) {
                exitCode = 1;
            }
            info.errors.errors.forEach(error => {
                console.log(`${error.message}`.red);
            });
        });
    });

    if (!exitCode) {
        console.log('npm-lint: No issues found'.green.bold);
    }

    process.exit(exitCode);
});

// .then(context => {
//     const rules = {};

//     // We load out rules via sync
//     Object.keys(context.rules).forEach(key => {
//         rules[key] = loadRule(key, __dirname);
//     });

//     console.log(`Using Rules: `.bold +  `${Object.keys(rules).join(', ')}`);

//     const rulesReports = Object.keys(rules).map(ruleKey => {
//         const rule = rules[ruleKey];
//         return rule.processor(context, context.rules[rule.key]);
//     });

//     const resolvedResults = Promise.all(rulesReports);

//     resolvedResults
//         .then(results => {
//             results.forEach(result => {
//                 console.log(`${result.name}`.underline);
//                 if (!result.errors || (result.errors && result.errors.length === 0)) {
//                     return console.log(`No Errors`.green);
//                 }
//                 exitCode = 1;
//                 result.errors.forEach(error => {
//                     console.error(`${error.message}`.red.bold);
//                 });
//             });
//             return Promise.resolve(null);
//         })
//         .then(() => {
//             if (context.rules.dependencies.checkLatest) {
//                 const scanner = loadScan('dependency_version_check', __dirname);

//                 const result = scanner.processor(context);
//                 result.then(results => {
//                     results.result.then(upgrades => {

//                         if (upgrades.upgrades && Object.keys(upgrades.upgrades).length > 0) {

//                             const table = new Table({
//                                 head: ['Package', 'Type', 'Package Version', 'Latest Version'],
//                                 colWidths: [40, 30, 30, 30]
//                             });

//                             Object.keys(upgrades.upgrades).forEach(upgrade => {
//                                 let dep;
//                                 let type = 'dependency';
//                                 if (context.package.dependencies[upgrade]) {
//                                     dep = context.package.dependencies[upgrade];
//                                 } else if (context.package.devDependencies[upgrade]) {
//                                     dep = context.package.devDependencies[upgrade];
//                                     type = 'devDependency';
//                                 }

//                                 table.push([upgrade, type, dep, upgrades.upgrades[upgrade]]);
//                             });
//                             console.log(`Available Dependency Updates`.underline.cyan);
//                             console.log(table.toString());
//                         } else {
//                             console.log('All dependencies are up to date'.underline.green.bold);
//                         }
//                         process.exit(exitCode);
//                     });
//                 });
//             }
//         });
// })
// .catch(error => {
//     console.log(`${error.message}`.red.bold);
//     process.exit(1);
// });

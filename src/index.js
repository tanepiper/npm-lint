let exitCode = 0;

process.on('unhandledRejection', function(err) {
  /*eslint-disable */
  console.log(err.stack);
  process.exit(1);
  /*eslint-enable */
});

process.on('uncaughtException', function(exception) {
  /*eslint-disable */
  console.log(exception); // to see your exception details in the console
  process.exit(1);
  /*eslint-enable */
});

require('colors');

const loki = require('lokijs');

const finalResults = new loki('npm-lint.json');

const dataObj = {
  workingDirectory: process.cwd(),
  info: finalResults.addCollection('info', { disableChangesApi: false }),
  errors: finalResults.addCollection('errors', { disableChangesApi: false }),
  warnings: finalResults.addCollection('warnings', { disableChangesApi: false })
};

dataObj.info.on('insert', result => {
  console.info(`Info: ${result.message}`.gray);
});

dataObj.errors.on('insert', result => {
  console.error(`Error: ${result.message}`.red);
});

dataObj.warnings.on('insert', result => {
  console.info(`Warning: ${result.message}`.yellow);
});

dataObj.info.insert({
  message: `${`Running npm-linter`.green}`.underline.bgBlue
});

const Table = require('cli-table');

const createContext = require('./lib/create-context');
const NoPackageFoundError = require('./errors/no-package-json-error');

const loadRule = require('./lib/load-rule');
const loadScan = require('./lib/load-scan');

const init = async function init() {
  let context;
  try {
    context = await createContext(dataObj);
  } catch (e) {
    if (e instanceof NoPackageFoundError) {
      return console.error('NoPackageFoundError', e.message);
    }
    throw e;
  }

  const allRules = {};
  Object.keys(context.rules).forEach(key => {
    allRules[key] = loadRule(key, __dirname);
  });

  dataObj.info.insert({
    message: `Using Rules: `.bold + `${Object.keys(allRules).join(', ')}`
  });

  return await Object.keys(allRules).map(async ruleKey => {
    const rules = allRules[ruleKey];
    let results;
    try {
      results = await rules.processor(context, context.rules[key]);
    } catch (e) {
      return e;
    }

    let { name, key, errors, warnings } = results;
    return { key, rules, errors };
  });
};

init().then(async results => {
  await results.forEach(async result => {
    await result.then(info => {
      console.log(
        `${info.errors.name}`.blue.underline +
          ` [Total issues: ${'' + info.errors.errors.length + ''.yellow}]`.bold
      );
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

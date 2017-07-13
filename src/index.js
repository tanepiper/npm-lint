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
const argv = require('yargs').argv;

const loki = require('lokijs');
const Table = require('cli-table');

const finalResults = new loki('npm-lint.json');

const dataObj = {
  argv: argv,
  workingDirectory: process.cwd(),
  important: finalResults.addCollection('important', {
    disableChangesApi: false
  }),
  info: finalResults.addCollection('info', {
    disableChangesApi: false
  }),
  errors: finalResults.addCollection('errors', { disableChangesApi: false }),
  warnings: finalResults.addCollection('warnings', { disableChangesApi: false })
};

if (argv.debug) {
  dataObj.info.on('insert', result => {
    console.info(`Info: ${result.message}`.gray);
  });
}

dataObj.errors.on('insert', result => {
  // On the first error we always trigger a change in exit code
  if (!exitCode) {
    exitCode = 1;
  }
  console.error(`Error: ${result.message}`.red);
});

dataObj.warnings.on('insert', result => {
  console.info(`Warning: ${result.message}`.yellow);
});

dataObj.important.on('insert', result => {
  console.info(`${result.message}`.cyan);
});

dataObj.important.insert({
  message: `${`Running npm-linter`.green}`.underline.bgBlue
});

const createContext = require('./lib/create-context');

const loadRule = require('./lib/load-rule');
const loadScan = require('./lib/load-scan');

const init = async function init() {
  let context;
  try {
    context = await createContext(dataObj);
  } catch (e) {
    dataObj.errors.insert({ message: e.message });
    process.exit(1);
  }

  const allRules = {};
  Object.keys(context.rules).forEach(key => {
    allRules[key] = loadRule(key, __dirname);
  });

  context.info.insert({
    message: `Using Rules: `.bold + `${Object.keys(allRules).join(', ')}`
  });

  await Object.keys(allRules).forEach(async ruleKey => {
    const rules = allRules[ruleKey];
    context.info.insert({ message: `Running ${rules.name}` });
    let results;
    try {
      await rules.processor(context);
    } catch (e) {
      context.errors.insert({ message: e.message });
    }
  });

  return context;
};

init().then(async context => {
  const table = new Table();

  table.push(
    { 'Total Errors': context.errors.count() },
    { 'Total Warnings': context.warnings.count() }
  );

  console.log(table.toString());

  if (context.rules.dependencies.checkLatest) {
    context.important.insert({
      message: `Doing dependency version check`.green
    });
    const scanner = loadScan('dependency_version_check', __dirname);

    let upgrades;
    try {
      upgrades = await scanner.processor(context);
    } catch (e) {
      context.errors.insert({ message: e.message });
    }
    if (upgrades.upgrades && Object.keys(upgrades.upgrades).length > 0) {
      const table = new Table({
        head: ['Package', 'Type', 'Package Version', 'Latest Version'],
        colWidths: [40, 30, 30, 30]
      });
      Object.keys(upgrades.upgrades).forEach(upgrade => {
        let dep;
        let type = 'dependency';
        if (context.package.dependencies[upgrade]) {
          dep = context.package.dependencies[upgrade];
        } else if (context.package.devDependencies[upgrade]) {
          dep = context.package.devDependencies[upgrade];
          type = 'devDependency';
        }

        table.push([upgrade, type, dep, upgrades.upgrades[upgrade]]);
      });
      context.important.insert({
        message: `Available Dependency Updates`.underline.cyan
      });
      console.log(table.toString());
    } else {
      context.important.insert({
        message: `All dependencies are up to date`.green
      });
    }
  }

  if (!exitCode) {
    context.important.insert({
      message: 'npm-lint: No issues found'.green.bold
    });
  }

  process.exit(exitCode);
});

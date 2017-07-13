const semverRegex = require('semver-regex');

module.exports = {
  name: 'Dependency Rule',
  key: 'dependencies',
  /**
     * Processor method
     * @param {Object} package The package.json as a JSON object
     * @param {Object} The rules for this plugin
     */
  processor: async context => {
    const rules = context.rules[module.exports.key];
    if (!context.package.dependencies) {
      context.warnings.insert({
        message: `${'package.json'
          .yellow} does not contain dependencies property but it is present in ${'.npmlint.json'
          .yellow}`
      });
    }

    const dependencies = context.package.dependencies || {};
    const devDependencies = context.package.devDependencies || {};

    const allDependencies = Object.keys(dependencies).concat(devDependencies);
    const allValues =  Object.keys(dependencies).map(key => dependencies[key]).concat(Object.keys(devDependencies).map(key => devDependencies[key]))

    allDependencies.forEach(dependency => {
      if (!dependency) {
        context.errors.insert({
          message: `${'package.json'.yellow} contains a blank dependency name`
        });
      }

      const valueIndex = allDependencies.indexOf(dependency);
      const semverOrPath = allValues[valueIndex];

      if (semverRegex().test(semverOrPath)) {
        return;
      }

      if (!rules.sources) {
          return;
      }

      const checkInAllowedList = rules.sources.find(rule =>
        semverOrPath.includes(rule)
      );
      if (!checkInAllowedList) {
        context.errors.insert({
          message: `${'package.json'
            .yellow} dependency "${dependency.blue}" has a version or location that is not allowed "${semverOrPath.red}"`
        });
      }
    });
  }
};

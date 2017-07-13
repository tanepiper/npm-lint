const propertyName = require('./subrules/properties-name');
const propertyVersion = require('./subrules/properties-version');

module.exports = {
  name: 'Properties Rules',
  description: 'Handles the checking of properties within a package.json file',
  key: 'properties',
  processor: async context => {
    const rules = context.rules[module.exports.key];
    rules.forEach(property => {
      if (!context.package[property]) {
        context.errors.insert({
          message: `${'package.json'
            .yellow} must have property "${property.yellow}"`
        });
      }

      if (property === 'name' || property === 'version') {
        propertyName.processor(context);
      }
    });
  }
};

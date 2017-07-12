const propertyName = require('./subrules/properties-name');
const propertyVersion = require('./subrules/properties-version');

module.exports = {
  name: 'Properties Rules',
  description: 'Handles the checking of properties within a package.json file',
  key: 'properties',
  processor: async (context, rules) => {

    const newItem = Object.assign({}, this, {
      errors: [],
      warnings: []
    });

    rules.forEach(property => {
      if (!context.package[property]) {
        newItem.errors.push(
          `package.json must have property "${property.yellow}"`.red
        );
      }

      if (property === 'name') {
        propertyName.processor(newItem, context.package.name);
      }

      if (property === 'version') {
        propertyVersion.processor(newItem, context.package.version);
      }
    });

    return newItem;
  }
};

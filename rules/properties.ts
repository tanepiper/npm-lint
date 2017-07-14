const propertyName = require('./subrules/properties-name');
const propertyVersion = require('./subrules/properties-version');

module.exports = {
    name: 'Properties Rules',
    description:
        'Handles the checking of properties within a package.json file',
    key: 'properties',
    processor: async (context: any) => {
        const rules = context.rules[module.exports.key];
        rules.forEach((property: string) => {
            if (!context.package[property]) {
                context.errors.insert({
                    message: `${'package.json'
                        .yellow} must have property "${property.yellow}"`
                });
            }

            if (property === 'name') {
                propertyName.processor(context);
            } else if (property === 'version') {
                propertyVersion.processor(context);
            }
        });
    }
};

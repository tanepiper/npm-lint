const propertyName = require('./subrules/properties-name');
const propertyVersion = require('./subrules/properties-version');

module.exports = {
    name: 'Property Rule',
    key: 'properties',
    processor: (context, rules) => {
        return Promise.resolve({
            name: module.exports.name,
            key: module.exports.key,
            errors: rules
                .map(property => {
                    if (!context.package[property]) {
                        return {
                            type: module.exports.name,
                            key: module.exports.key,
                            message: `package.json must have property "${property}"`,
                            level: 'error'
                        };
                    }

                    if (property === 'name') {
                        return propertyName.processor(context.package.name);
                    }

                    if (property === 'version') {
                        return propertyVersion.processor(context.package.version);
                    }
                })
                .filter(error => error)
        });
    }
};

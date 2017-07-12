module.exports = {
    name: 'Property Rule',
    key: 'properties',
    processor: (context, propertiesRules) => {
        return Promise.resolve({
            name: module.exports.name,
            key: module.exports.key,
            errors: propertiesRules
                .map(property => {
                    if (!context.package[property]) {
                        return {
                            type: module.exports.name,
                            key: module.exports.key,
                            message: `package.json must property "${property}"`,
                            level: 'error'
                        };
                    }
                })
                .filter(error => error)
        });
    }
};

module.exports = {
    name: 'Include Rule',
    key: 'include',
    processor: (package, includeRules) => {
        return {
            name: module.exports.name,
            key: module.exports.key,
            errors: includeRules
                .map(include => {
                    if (!package[include]) {
                        return {
                            type: module.exports.name,
                            key: module.exports.key,
                            message: `Package must include ${include}`,
                            level: 'error'
                        }
                    }
                })
                .filter(error => error)
        };
    }
};

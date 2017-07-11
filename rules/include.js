module.exports = {
    name: 'Include Rule',
    key: 'include',
    processor: (package, includeRules) => {
        return includeRules.map((include) => {
            if (!package[include]) {
                return `Package must include ${include}`;
            }
        }).filter(error => error);
    }
}


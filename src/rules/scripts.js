module.exports = {
    name: 'Script rule',
    key: 'scripts',
    processor: async (context, rules) => {
        if (!context.package.scripts) {
            return {
                name: module.exports.name,
                key: module.exports.key,
                errors: [{
                    type: module.exports.name,
                    key: module.exports.key,
                    message: `package.json does not contain scripts but .npmlint.json contains rules`,
                    level: 'error'
                }]
            };
        }
        return {
            name: module.exports.name,
            key: module.exports.key,
            errors: Object.keys(context.package.scripts)
                .map(scriptName => {
                    const script = context.package.scripts[scriptName];

                    // Find all executables called in this script
                    const exeFiles = script.split('&&').map(item => item.trim().split(' ')).map(item => item[0]);

                    return exeFiles
                        .map(exeFile => {
                            if (!rules.allow.includes(exeFile)) {
                                return {
                                    type: module.exports.name,
                                    key: module.exports.key,
                                    message: `package.json script "${scriptName}" has a unknown executable "${exeFile}"`,
                                    level: 'error'
                                };
                            }
                        })
                        .filter(error => error);
                })
                .reduce((prev, current) => {
                    return prev.concat(current);
                }, [])
        };
    }
};

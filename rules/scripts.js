module.exports = {
    name: 'Script rule',
    key: 'script',
    processor: (package, scriptRules) => {

        return {
            name: module.exports.name,
            key: module.exports.key,
            errors: Object.keys(package.scripts)
                .map(scriptName => {
                    const script = package.scripts[scriptName];

                    // Find all executables called in this script
                    const exeFiles = script
                        .split('&&')
                        .map(item => item.trim().split(' '))
                        .map(item => item[0]);

                    return exeFiles
                        .map(exeFile => {
                            if (!scriptRules.allow.includes(exeFile)) {
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

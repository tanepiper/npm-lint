module.exports = (package, scriptRules) => {

     Object.keys(package.scripts).map((scriptName) => {

        const script = package.scripts[scriptName];
        // Find all executables called in this script

        const scriptParts = script.split('&&').map(item => item.trim().split(' '));
        
        return scriptParts.map(scriptPart => {
            if (!lintingRules.scripts.allow.includes(scriptPart[0])) {
                 return `Script ${scriptName} has a unknown executable ${scriptPart[0]}`;
            }
        }).filter(error => error);
    });
}
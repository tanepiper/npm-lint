const fs = require('fs');
const {promisify} = require('util');
const readDirAsync = promisify(fs.readdir);

module.exports = (key, rulesDir) => {
    let ruleFile;
    try {
        ruleFile = require(`${rulesDir}/rules/${key}.js`);
    } catch (e) {
        return console.error(`Cannot load rule ${key}.js in ${rulesDir}`);
    }
    return ruleFile;
}
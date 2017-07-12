module.exports = (key, basedir) => {
    let ruleFile;
    try {
        ruleFile = require(`${basedir}/rules/${key}.js`);
    } catch (e) {
        return new Error(`Cannot load rule ${key}.js in ${basedir}/rules`);
    }
    return ruleFile;
}
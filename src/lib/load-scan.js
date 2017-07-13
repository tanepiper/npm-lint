const path = require('path');

module.exports = (key, basedir) => {
    let scanFile;
    try {
        scanFile = require(`../../scans/${key}.js`);
    } catch (e) {
        return console.error(`Cannot load scanner ${key}.js in ${basedir}/scans`);
    }
    return scanFile;
}
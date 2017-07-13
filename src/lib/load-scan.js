const fs = require('fs');
const {promisify} = require('util');
const readDirAsync = promisify(fs.readdir);

module.exports = (key, basedir) => {
    let scanFile;
    try {
        scanFile = require(`${basedir}/scans/${key}.js`);
    } catch (e) {
        return console.error(`Cannot load scanner ${key}.js in ${basedir}/scans`);
    }
    return scanFile;
}
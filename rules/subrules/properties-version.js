const semverRegex = require('semver-regex');

module.exports = {
    name: 'Property Name Rule',
    key: 'properties.version',
    processor: (version) => {
        // Rules as per https://docs.npmjs.com/files/package.json#version
        if (!semverRegex().test(version)) {
             return {
                type: module.exports.name,
                key: module.exports.key,
                message: `package.json "version" property is not a valid semver`,
                level: 'error'
            };
        }
    }
}
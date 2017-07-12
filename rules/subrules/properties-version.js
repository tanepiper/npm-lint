const semverRegex = require('semver-regex');

module.exports = {
  name: 'Property Name Rule',
  key: 'properties.version',
  processor: (newItem, version) => {
    // Rules as per https://docs.npmjs.com/files/package.json#version
    if (!semverRegex().test(version)) {
      newItem.errors.push(
        `package.json "version" property is not a valid semver`
      );
    }
  }
};

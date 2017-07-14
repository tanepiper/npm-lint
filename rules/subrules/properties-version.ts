import semverRegex from 'semver-regex';

module.exports = {
  name: 'Property Name Rule',
  key: 'properties.version',
  processor: (context:any) => {
    // Rules as per https://docs.npmjs.com/files/package.json#version
    const version = context.package.version;
    if (!semverRegex().test(version)) {
      context.errors.insert({
        message: `${'package.json'.yellow} "${'version'.blue}" property is not a valid semver ${version.red}`
      });
    }
  }
};

import * as semverRegex from 'semver-regex';

import * as types from './../../src/types';

export default {
  name: 'Property Name Rule',
  key: 'properties.version',
  processor: (context: types.IContextObject) => {
    // Rules as per https://docs.npmjs.com/files/package.json#version
    const version = context.package.version;
    if (!semverRegex().test(version)) {
      context.errors.insert({
        message: `${'package.json'.yellow} "${'version'.blue}" property is not a valid semver ${version.red}`
      });
    }
  }
};

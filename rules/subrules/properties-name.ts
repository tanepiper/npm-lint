const nameValidCheck = /^[a-zA-Z0-9_-]*$/gi;

import * as types from './../../src/types';

export default {
  name: 'Property Name Rule',
  key: 'properties.name',
  processor: (context: types.IContextObject): void => {
    // Rules as per https://docs.npmjs.com/files/package.json#name

    const name: string = context.package.name;

    if (name.length > 214) {
      context.errors.insert({
        message: `${'package.json'.yellow} "${'name'.blue}" property cannot be longer than 214 characters`
      });
    }

    if (name.charAt(0) === '.' || name.charAt(0) === '_') {
      context.errors.insert({
        message: `${'package.json'.yellow} "${'name'.blue}" property cannot start with a . (dot) or _ (underscore)`
      });
    }

    if (!name.match(nameValidCheck)) {
      context.errors.insert({
        message: `${'package.json'.yellow} "${'name'.blue}" property cannot contain non-URL-safe characters`
      });
    }

    if (name.charAt(0) === name.charAt(0).toUpperCase()) {
      context.errors.insert({
        message: `${'package.json'.yellow} "${'name'.blue}" property cannot start with a capital letter`
      });
    }
  }
};

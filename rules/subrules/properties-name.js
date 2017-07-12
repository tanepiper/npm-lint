const nameValidCheck = /^[a-zA-Z0-9_-]*$/gi;

module.exports = {
  name: 'Property Name Rule',
  key: 'properties.name',
  processor: (newItem, name) => {
    // Rules as per https://docs.npmjs.com/files/package.json#name

    if (name.length > 214) {
      newItem.errors.push(
        `package.json "name" property cannot be longer than 214 characters`
      );
    }

    if (name.charAt(0) === '.' || name.charAt(0) === '_') {
      newItem.errors.push(
        `package.json "name" property cannot start with a . (dot) or _ (underscore)`
      );
    }

    if (!name.match(nameValidCheck)) {
      newItem.errors.push(
        `package.json "name" property cannot contain non-URL-safe characters`
      );
    }

    if (name.charAt(0) == name.charAt(0).toUpperCase()) {
      newItem.errors.push(
        `package.json "name" property cannot start with a capital letter`
      );
    }
  }
};

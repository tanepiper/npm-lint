const nameValidCheck = /^[a-zA-Z0-9_-]*$/gi;

module.exports = {
    name: 'Property Name Rule',
    key: 'properties.name',
    processor: (name) => {
        // Rules as per https://docs.npmjs.com/files/package.json#name

        if (name.length > 214) {
            return {
                type: module.exports.name,
                key: module.exports.key,
                message: `package.json "name" property cannot be longer than 214 characters`,
                level: 'error'
            };
        }

        if (name.charAt(0) === '.' || name.charAt(0) === '_') {
            return {
                type: module.exports.name,
                key: module.exports.key,
                message: `package.json "name" property cannot start with a . (dot) or _ (underscore)`,
                level: 'error'
            };
        }

        if (!name.match(nameValidCheck)) {
            return {
                type: module.exports.name,
                key: module.exports.key,
                message: `package.json "name" property cannot contain non-URL-safe characters`,
                level: 'error'
            };
        }

        if (name.charAt(0) == name.charAt(0).toUpperCase()) {
            return {
                type: module.exports.name,
                key: module.exports.key,
                message: `package.json "name" property cannot start with a capital letter`,
                level: 'error'
            };
        }
    }
}
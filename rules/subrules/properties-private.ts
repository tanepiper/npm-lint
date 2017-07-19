import * as types from './../../src/types';

export default {
    name: 'Private Module',
    key: 'private',
    processor: (context: types.IContextObject): void => {
        // Rules as per https://docs.npmjs.com/files/package.json#version

        if (context.package && typeof context.package.private !== 'undefined' && context.package.private === false) {
            context.errors.insert({
                message: `${'package.json'.yellow} "private" property must be set to ${`true`.red}`
            });
        }
    }
};

import * as types from './../../src/types';

export default {
    name: 'Private Module',
    key: 'private',
    processor: (context: types.IContextObject): void => {
        console.log('foo');

        if (context.package && typeof context.package.private === 'undefined') {
            context.errors.insert({
                message: `${'package.json'.yellow} "private" property is missing. This must be set to ${`true`.red}`
            });
        } else if (context.package && typeof context.package.private !== 'undefined' && context.package.private === false) {
            context.errors.insert({
                message: `${'package.json'.yellow} "private" property must be set to ${`true`.red}`
            });
        }
    }
};

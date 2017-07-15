import propertyName from './subrules/properties-name';
import propertyVersion from './subrules/properties-version';

import * as types from '../src/types';

export default {
    name: 'Properties Rules',
    description:
        'Handles the checking of properties within a package.json file',
    key: 'properties',
    processor: async (context: types.IContextObject): Promise<void> => {

        const rules: string[] = context.rules[module.exports.key];
        if (!rules || rules && rules.length === 0) {
            return;
        }

        rules.forEach((property: string): void => {
            if (!context.package[property]) {
                context.errors.insert({
                    message: `${'package.json'
                        .yellow} must have property "${property.yellow}"`
                });
            }

            if (property === 'name') {
                propertyName.processor(context);
            } else if (property === 'version') {
                propertyVersion.processor(context);
            }
        });
    }
};

import propertyName from './subrules/properties-name';
import propertyVersion from './subrules/properties-version';
import propertyPrivate from './subrules/properties-version';

import * as types from '../src/types';

export default {
    name: 'Properties Rules',
    description: 'Handles the checking of properties within a package.json file',
    key: 'properties',
    processor: async (context: types.IContextObject): Promise<void> => {
        const rules: { required?: string[]; private?: boolean } = context.rules.properties;
        if (!rules) {
            return;
        }

        (rules.required || []).forEach((property: string): void => {
            if (!context.package[property]) {
                context.errors.insert({
                    message: `${'package.json'.yellow} must have property "${property.yellow}"`
                });
            }

            if (property === 'name') {
                propertyName.processor(context);
            } else if (property === 'version') {
                propertyVersion.processor(context);
            }
        });

        if (typeof rules.private !== 'undefined' && rules.private === true) {
            propertyPrivate.processor(context);
        }
    }
};

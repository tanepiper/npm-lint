import * as semver from 'semver';

import * as types from './../../src/types';
import getValidSemver from '../../src/lib/get-valid-semver';

export default {
    name: 'Property Name Rule',
    key: 'properties.version',
    processor: (context: types.IContextObject): void => {
        // Rules as per https://docs.npmjs.com/files/package.json#version

        const validSemver: string | null = getValidSemver(context.package.version);
        if (!(validSemver && semver.valid(validSemver))) {
            context.errors.insert({
                message: `${'package.json'.yellow} "${'version'.blue}" property is not a valid semver ${context.package.version.red}`
            });
        }
    }
};

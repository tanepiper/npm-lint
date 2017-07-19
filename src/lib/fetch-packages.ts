/**
 * Code taken from https://github.com/sindresorhus/package-json
 */

import BPromise = require('bluebird');
import * as types from '../types';

import got = require('got');
import url = require('url');
import registryAuthToken = require('registry-auth-token');
import * as semver from 'semver';

export default async (currentContext: types.IContextObject, allPackages: string[]) => {
    const pkgs = await BPromise.map(allPackages, (packagename: string) => {
        const regUrl = currentContext.registry || `https://registry.npmjs.org/`;
        const pkgUrl = url.resolve(regUrl, encodeURIComponent(packagename).replace(/^%40/, '@'));
        const authInfo = registryAuthToken(regUrl, { recursive: true });
        const opts: { version; allVersions? } = {
            version: 'latest'
        };

        const headers: { accept; authorization?; 'user-agent'? } = {
            accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*',
            'user-agent': 'npm-lint version <=1.0.0'
        };

        // if (opts.fullMetadata) {
        //     delete headers.accept;
        // }

        if (authInfo) {
            headers.authorization = `${authInfo.type} ${authInfo.token}`;
        }

        return got(pkgUrl, { json: true, headers })
            .then(res => {
                let data = res.body;
                let version = opts.version;

                if (opts.allVersions) {
                    return data;
                }

                if (data['dist-tags'][version]) {
                    data = data.versions[data['dist-tags'][version]];
                } else if (version) {
                    if (!data.versions[version]) {
                        const versions = Object.keys(data.versions);
                        version = semver.maxSatisfying(versions, version);

                        if (!version) {
                            return currentContext.errors.insert({
                                message: `Version doesn't exist ${version} for ${packagename}`
                            });
                        }
                    }

                    data = data.versions[version];

                    if (!data) {
                        return currentContext.errors.insert({
                            message: `Version doesn't exist ${version} for ${packagename}`
                        });
                    }
                }

                return data;
            })
            .catch(err => {
                if (err.statusCode === 404) {
                    return currentContext.errors.insert({
                        message: `Package "${packagename}" doesn't exist`
                    });
                }

                currentContext.errors.insert({
                    message: err.status
                });
            });
    });

    return pkgs;
};

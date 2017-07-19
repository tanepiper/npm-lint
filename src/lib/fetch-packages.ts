/**
 * Code taken from https://github.com/sindresorhus/package-json
 */

import BPromise = require('bluebird');

import got = require('got');
import url = require('url');
import registryUrl = require('registry-url');
import registryAuthToken = require('registry-auth-token');
import semver = require('semver');

export default async allPackages => {
    const pkgs = await BPromise.map(allPackages, (packagename: string) => {
        const scope = packagename.split('/')[0];
        const regUrl = registryUrl(scope);
        const pkgUrl = url.resolve(regUrl, encodeURIComponent(packagename).replace(/^%40/, '@'));
        const authInfo = registryAuthToken(regUrl, { recursive: true });
        const opts: { version; allVersions? } = {
            version: 'latest'
        };

        const headers: { accept; authorization? } = {
            accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'
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
                            throw new Error("Version doesn't exist");
                        }
                    }

                    data = data.versions[version];

                    if (!data) {
                        throw new Error("Version doesn't exist");
                    }
                }

                return data;
            })
            .catch(err => {
                if (err.statusCode === 404) {
                    throw new Error(`Package \`${packagename}\` doesn't exist`);
                }

                throw err;
            });
    });

    return pkgs;
};

// Regexp from https://github.com/sindresorhus/semver-regex

/**
 * Return a valid semver value or null
 * @param {string} potentialSemver The value to check for a semver
 * @returns {string} || null
 */

export default (potentialSemver: string): string | null => {
    const isSemver: RegExpMatchArray | null = (potentialSemver || '').match(/\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?\b/);
    return isSemver && isSemver[0] || null;
};

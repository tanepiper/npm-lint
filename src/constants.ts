export const ERROR_PACKAGE_NAME_TOO_LONG = `${'package.json'.yellow} "${'name'.blue}" property cannot be longer than 214 characters`;
export const ERROR_PACKAGE_NAME_DOT_OR_UNDERSCORE = `${'package.json'.yellow} "${'name'.blue}" property cannot start with a . (dot) or _ (underscore)`;
export const ERROR_PACKAGE_NAME_UNSAFE_CHARACTERS = `${'package.json'.yellow} "${'name'.blue}" property cannot contain non-URL-safe characters`;
export const ERROR_PACKAGE_NAME_CAPITAL_LETTER = `${'package.json'.yellow} "${'name'.blue}" property cannot start with a capital letter`;

export enum ExitCodes {
    OK = 0,
    ERROR = 1
}

export const DEFAULT_CONFIG = {
    options: {},
    rules: {
        properties: ['description', 'main', 'author', 'license'],
        scripts: {
            allow: ['node', 'npm', 'echo', 'exit']
        },
        dependencies: {
            checkLatest: false
        }
    }
};

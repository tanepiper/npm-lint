export type ContextObject = {
    package: {
        name: string;
        version: string;
    };
    options: object;
    rules: object;
    npmLintFile: string;
    argv: object;
    errors: {
        insert: Function;
    };
    warnings: {
        insert: Function;
    };
    info: {
        insert: Function;
    };
};

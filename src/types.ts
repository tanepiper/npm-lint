export interface IContextObject {
    package: {
        name: string;
        version: string;
        scripts: string;
        dependencies: object;
        devDependencies: object;
    };
    options: object;
    rules: {
        scripts: {
            allow: string[];
        };
    };
    npmLintFile: string;
    argv: object;
    errors: {
        insert: (value: { message: string }) => {};
    };
    warnings: {
        insert: (value: { message: string }) => {};
    };
    info: {
        insert: (value: { message: string }) => {};
    };
}

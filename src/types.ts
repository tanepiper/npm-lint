export interface IPackage {
    name: string;
    version: string;
    scripts?: string;
    dependencies?: object;
    devDependencies?: object;
    npmLint?: {
        options?: object;
        rules?: {
            scripts?: {
                allow?: string[];
            };
            properties?: string[];
        };
    };
}

export interface IContextObject {
    workingDirectory: string;
    package?: IPackage;
    packageFile?: string;
    npmLintFile?: string;
    options?: object;
    rules?: {
        scripts?: {
            allow?: string[];
        };
        properties?: string[];
    };
    errors: {
        insert: (value: { message: string }) => void;
        on: (event: string, cb: (result: Error) => void) => void;
    };
    warnings: {
        insert: (value: { message: string }) => void;
        on: (event: string, cb: (result: Error) => void) => void;
    };
    info: {
        insert: (value: { message: string }) => void;
        on: (event: string, cb: (result: Error) => void) => void;
    };
    important: {
        insert: (value: { message: string }) => void;
        on: (event: string, cb: (result: Error) => void) => void;
    };
}

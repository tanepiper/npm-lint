export interface IDependencyRules {
    checkLatest?: boolean;
    allowLatest?: boolean;
    sources: string[];
}

export interface IScriptRules {
    allow?: string[];
}

export interface IPackage {
    name: string;
    version: string;
    scripts?: object;
    private?: boolean;
    dependencies?: object;
    devDependencies?: object;
    npmLint?: {
        options?: object;
        rules?: {
            scripts?: IScriptRules;
            properties?: string[];
            dependencies?: IDependencyRules;
        };
    };
}

export interface IContextObject {
    _?: object;
    $0?: string;
    argv?: object;
    registry?: string;
    forceDependencyCheck?: boolean;
    workingDirectory?: string;
    package?: IPackage;
    packageFile?: string;
    npmLintFile?: string;
    options?: object;
    rules?: {
        scripts?: IScriptRules;
        properties?: {
            private?: boolean;
            required?: string[]
        };
        dependencies?: IDependencyRules;
    };
    errors?: {
        insert: (value: { message: string }) => void;
        on: (event: string, cb: (result: Error) => void) => void;
    };
    warnings?: {
        insert: (value: { message: string }) => void;
        on: (event: string, cb: (result: Error) => void) => void;
    };
    info?: {
        insert: (value: { message: string }) => void;
        on: (event: string, cb: (result: Error) => void) => void;
    };
    important?: {
        insert: (value: { message: string }) => void;
        on: (event: string, cb: (result: Error) => void) => void;
    };
}

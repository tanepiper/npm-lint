declare namespace npmLint {
    type DependencyRules = {
        checkLatest?: boolean;
        allowLatest?: boolean;
        sources: string[];
    };

    type ScriptRules = {
        allow?: string[];
    };

    type Package = {
        name: string;
        version: string;
        scripts?: object;
        dependencies?: object;
        devDependencies?: object;
        npmLint?: {
            options?: object;
            rules?: {
                scripts?: ScriptRules;
                properties?: string[];
                dependencies?: DependencyRules;
            };
        };
    };

    interface ContextObject {
        workingDirectory: string;
        package?: Package;
        packageFile?: string;
        npmLintFile?: string;
        options?: object;
        rules?: {
            scripts?: ScriptRules;
            properties?: string[];
            dependencies?: DependencyRules;
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
}

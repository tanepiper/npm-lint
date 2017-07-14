export default {
    options: {},
    rules: {
        properties: ['description', 'main', 'author', 'license'],
        scripts: {
            allow: ['node', 'npm', 'echo', 'exit']
        },
        dependencies: {
            checkLatest: false,
            sources: ['latest', 'https://github.com', 'http://bitbucket.org']
        }
    }
}

module.exports = {
    name: 'Version Rule',
    key: 'version',
    processor: (context) => {
        if (!context.package.version) {
            return 'Package must include version';
        }
    }
}
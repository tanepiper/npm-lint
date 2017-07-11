module.exports = {
    name: 'Version Rule',
    key: 'version',
    processor: (package) => {
        if (!package.version) {
            return "Package must include version";
        }
    }
}
module.exports = {
    name: 'Name Rule',
    key: 'name',
    processor: (context) => {
        if (!context.package.name) {
            return 'Package must include name';
        }
    }
}
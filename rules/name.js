module.exports = {
    name: 'Name Rule',
    key: 'name',
    processor: (package) => {
        if (!package.name) {
            return "Package must include name";
        }
    }
}
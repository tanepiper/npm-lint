export default (value): string | null => {
    const isSemver: RegExpMatchArray | null = value.match(/\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?\b/);
    return isSemver && isSemver[0] || null;
};

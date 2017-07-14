module.exports = {
  name: 'Script rule',
  key: 'scripts',
  processor: async (context:any) => {
    if (!context.package.scripts) {
      context.warnings.insert({
        message: `${'package.json'
          .yellow} does not contain scripts property but it is present in ${'.npmlint.json'
          .yellow}`
      });
      return;
    }

    Object.keys(context.package.scripts).forEach(scriptName => {
      const script = context.package.scripts[scriptName];

      // Find all executables called in this script
      const exeFiles = script
        .split('&&')
        .map((item:string) => item.trim().split(' '))
        .map((items:Array<string>) => items[0]);

      return exeFiles.forEach((exeFile: string) => {
        if (!context.rules.scripts.allow.includes(exeFile)) {
          context.errors.insert({
            message: `${'package.json'
              .yellow} script "${scriptName.blue}" has a unknown executable "${exeFile.red}"`
          });
        }
      });
    });
  }
};

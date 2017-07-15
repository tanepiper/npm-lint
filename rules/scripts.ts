import * as types from './../src/types';

export default {
  name: 'Script rule',
  key: 'scripts',
  processor: (context: types.IContextObject) => {
    if (!context.package.scripts) {
      context.warnings.insert({
        message: `${'package.json'
          .yellow} does not contain scripts property but it is present in ${'.npmlint.json'
          .yellow}`
      });
      return;
    }

    const rules: types.IScriptRules = context.rules.scripts;
    const scripts: object = context.package && context.package.scripts || [];

    Object.keys(scripts).forEach((scriptName: string) => {
      const script: string = context.package.scripts[scriptName];

      // Find all executables called in this script
      const exeFiles: string[] = script
        .split('&&')
        .map((item: string) => item.trim().split(' '))
        .map((items: string[]) => items[0]);

      return exeFiles.forEach((exeFile: string) => {
        if (!rules.allow.includes(exeFile)) {
          context.errors.insert({
            message: `${'package.json'
              .yellow} script "${scriptName.blue}" has a unknown executable "${exeFile.red}"`
          });
        }
      });
    });
  }
};

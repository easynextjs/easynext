import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import output from '@/output-manager';
import { GlobalConfig, isValidLang } from '@/global/config/global.config';
import { writeToConfigFile } from '@/util/config/files';

@Command({
  name: 'lang',
  description: 'Set language',
  arguments: '[lang]',
  argsDescription: {
    lang: '(optional) pass language code (en, ko)',
  },
})
export class LangCommand extends AbstractCommand {
  constructor(private config: GlobalConfig) {
    super();
  }

  async run(passedParam: string[]) {
    if (passedParam.length === 0) {
      output.info(`Current lang: ${this.config.lang}`);
      return;
    } else if (passedParam.length === 1) {
      if (isValidLang(passedParam[0])) {
        const lang = passedParam[0];

        if (this.config.lang === lang) {
          output.info(`Lang is already set to ${lang}`);
          return;
        }

        writeToConfigFile({ ...this.config, lang });
        output.info(`Lang is set to ${lang}`);
      } else {
        output.error('Invalid language code');
      }
    } else {
      output.error('Invalid parameter given');
    }
  }
}

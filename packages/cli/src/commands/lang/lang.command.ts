import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import output, { updateLanguage } from '@/output-manager';
import { GlobalConfig, isValidLang } from '@/global/config/global.config';
import { writeToConfigFile } from '@/util/config/files';
import i18n from '@/util/i18n';

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
    // 초기 언어 설정 적용
    updateLanguage(this.config);
  }

  async run(passedParam: string[]) {
    if (passedParam.length === 0) {
      output.info(`${i18n.t('lang.current')} ${this.config.lang}`);
      return;
    } else if (passedParam.length === 1) {
      if (isValidLang(passedParam[0])) {
        const lang = passedParam[0];

        if (this.config.lang === lang) {
          output.info(`${i18n.t('lang.already_set')} ${lang}`);
          return;
        }

        const updatedConfig = { ...this.config, lang };
        writeToConfigFile(updatedConfig);

        // 언어 설정 변경 후 output-manager 업데이트
        updateLanguage(updatedConfig);

        output.info(`${i18n.t('lang.set_to')} ${lang}`);
      } else {
        output.error(i18n.t('lang.invalid_code'));
      }
    } else {
      output.error(i18n.t('lang.invalid_param'));
    }
  }
}

import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import { version as PACKAGE_VERSION } from '../../../package.json';
import output from '../../output-manager';
import i18n from '@/util/i18n';

@Command({
  name: 'version',
  description: '현재 설치된 EasyNext CLI의 버전을 표시합니다',
  aliases: ['v'],
})
export class VersionCommand extends AbstractCommand {
  async run(): Promise<void> {
    output.info(`${i18n.t('version.current')} v${PACKAGE_VERSION}`);
  }
}

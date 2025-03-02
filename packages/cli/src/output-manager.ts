import { Output } from './util/output';
import i18n from './util/i18n';
import { GlobalConfig } from './global/config/global.config';

const output = new Output(process.stderr, {
  debug: false,
});

/**
 * 언어 설정을 업데이트합니다.
 * @param config 글로벌 설정
 */
export function updateLanguage(config: GlobalConfig): void {
  i18n.initializeFromConfig(config);
}

/**
 * A managed singleton instance of the Output class.
 */
export default output;

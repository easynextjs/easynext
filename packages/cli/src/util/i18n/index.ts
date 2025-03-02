import { GlobalConfig, LangCode } from '@/global/config/global.config';

// 기본 언어 설정
let currentLang: LangCode = 'en';

// 언어 리소스
const resources: Record<LangCode, Record<string, string>> = {
  en: {
    // 공통 메시지
    'info.success': 'Success!',
    'info.ready': 'Ready!',
    'info.error': 'Error:',
    'info.warn': 'WARN!',
    'info.note': 'NOTE:',

    // 명령어별 메시지
    'lang.current': 'Current lang:',
    'lang.already_set': 'Lang is already set to',
    'lang.set_to': 'Lang is set to',
    'lang.invalid_code': 'Invalid language code',
    'lang.invalid_param': 'Invalid parameter given',
  },
  ko: {
    // 공통 메시지
    'info.success': '성공!',
    'info.ready': '준비 완료!',
    'info.error': '오류:',
    'info.warn': '경고!',
    'info.note': '참고:',

    // 명령어별 메시지
    'lang.current': '현재 언어:',
    'lang.already_set': '이미 다음 언어로 설정되어 있습니다:',
    'lang.set_to': '언어가 다음으로 설정되었습니다:',
    'lang.invalid_code': '유효하지 않은 언어 코드입니다',
    'lang.invalid_param': '유효하지 않은 매개변수가 제공되었습니다',
  },
};

/**
 * 현재 언어 설정을 업데이트합니다.
 */
export function setLanguage(lang: LangCode): void {
  currentLang = lang;
}

/**
 * 현재 언어 설정을 반환합니다.
 */
export function getLanguage(): LangCode {
  return currentLang;
}

/**
 * 글로벌 설정에서 언어를 초기화합니다.
 */
export function initializeFromConfig(config: GlobalConfig): void {
  if (config.lang) {
    setLanguage(config.lang);
  }
}

/**
 * 키에 해당하는 번역된 문자열을 반환합니다.
 * 키가 존재하지 않으면 키 자체를 반환합니다.
 */
export function t(key: string, ...args: any[]): string {
  const message = resources[currentLang][key] || key;

  // 간단한 포맷팅 지원 (args가 있는 경우)
  if (args.length > 0) {
    return message.replace(/{(\d+)}/g, (match, index) => {
      const argIndex = parseInt(index, 10);
      return argIndex < args.length ? args[argIndex] : match;
    });
  }

  return message;
}

export default {
  t,
  setLanguage,
  getLanguage,
  initializeFromConfig,
};

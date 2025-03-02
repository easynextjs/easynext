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

    // Create 명령어 메시지
    'create.success': 'Project created successfully',
    'create.template_success': 'Template has been successfully installed',
    'create.login_required': 'Error: Login required. Please login.',
    'create.login_usage': 'Usage: easynext login <token>',
    'create.template_error':
      'Error: An error occurred while downloading the template.',
    'create.template_guide': 'Guide: https://easynext.org/premium/guide',
    'create.downloading': 'Downloading template from',
    'create.unsupported_format': 'Unsupported template file format.',
    'create.installing': 'Installing dependencies...',
    'create.npm_naming_error': 'Could not create a project called',
    'create.npm_naming_restrictions': 'because of npm naming restrictions:',
    'create.not_writable':
      'The application path is not writable, please check folder permissions and try again.',
    'create.no_permissions':
      'It is likely you do not have write permissions for this folder.',
    'create.creating_app': 'Creating a new Next.js app in',
    'create.skip_git': 'Skipping git initialization.',
    'create.git_initialized': 'Initialized a git repository.',
    'create.success_created': 'Created',
    'create.success_at': 'at',
    'create.run_commands':
      'Inside that directory, you can run several commands:',
    'create.run_dev': 'Starts the development server.',
    'create.run_build': 'Builds the app for production.',
    'create.run_start': 'Runs the built app in production mode.',
    'create.suggest_begin': 'We suggest that you begin by typing:',
    'create.folder_conflict':
      'The directory {0} contains files that could conflict:',
    'create.folder_conflict_solution':
      'Either try using a new directory name, or remove the files listed above.',
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

    // Create 명령어 메시지
    'create.success': '프로젝트가 성공적으로 생성되었습니다',
    'create.template_success': '템플릿이 성공적으로 설치되었습니다',
    'create.login_required': '오류: 로그인이 필요합니다. 로그인해주세요.',
    'create.login_usage': '사용법: easynext login <token>',
    'create.template_error': '오류: 템플릿 다운로드 중 오류가 발생했습니다.',
    'create.template_guide': '안내: https://easynext.org/premium/guide',
    'create.downloading': '다음 위치에서 템플릿 다운로드 중:',
    'create.unsupported_format': '지원하지 않는 템플릿 파일 형식입니다.',
    'create.installing': '의존성 패키지 설치 중...',
    'create.npm_naming_error': '다음 이름으로 프로젝트를 생성할 수 없습니다:',
    'create.npm_naming_restrictions': 'npm 이름 제한 때문입니다:',
    'create.not_writable':
      '애플리케이션 경로에 쓰기 권한이 없습니다. 폴더 권한을 확인하고 다시 시도해주세요.',
    'create.no_permissions': '이 폴더에 대한 쓰기 권한이 없는 것 같습니다.',
    'create.creating_app': '다음 위치에 새로운 Next.js 앱을 생성합니다:',
    'create.skip_git': 'Git 초기화를 건너뜁니다.',
    'create.git_initialized': 'Git 저장소가 초기화되었습니다.',
    'create.success_created': '생성 완료:',
    'create.success_at': '위치:',
    'create.run_commands':
      '해당 디렉토리에서 다음 명령어를 실행할 수 있습니다:',
    'create.run_dev': '개발 서버를 시작합니다.',
    'create.run_build': '프로덕션용 앱을 빌드합니다.',
    'create.run_start': '빌드된 앱을 프로덕션 모드로 실행합니다.',
    'create.suggest_begin': '다음과 같이 시작하는 것을 권장합니다:',
    'create.folder_conflict':
      '디렉토리 {0}에 충돌할 수 있는 파일이 포함되어 있습니다:',
    'create.folder_conflict_solution':
      '새 디렉토리 이름을 사용하거나 위에 나열된 파일을 제거하세요.',
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

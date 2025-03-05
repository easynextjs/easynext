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

    // Version 명령어 메시지
    'version.current': 'Current version:',

    // Login 명령어 메시지
    'login.success': 'Login successful',
    'login.token_saved': 'Token saved successfully',
    'login.invalid_token': 'Invalid token',
    'login.token_required': 'Token is required',

    // Auth 명령어 메시지
    'auth.logged_in': 'Logged in as',
    'auth.not_logged_in': 'Not logged in',
    'auth.logout_success': 'Logged out successfully',

    // Doctor 명령어 메시지
    'doctor.checking': 'Checking your system...',
    'doctor.node_version': 'Node.js version:',
    'doctor.npm_version': 'npm version:',
    'doctor.yarn_version': 'Yarn version:',
    'doctor.pnpm_version': 'pnpm version:',
    'doctor.git_version': 'Git version:',
    'doctor.os': 'Operating System:',
    'doctor.cpu': 'CPU:',
    'doctor.memory': 'Memory:',
    'doctor.all_good': 'All checks passed!',
    'doctor.issues_found': 'Issues found:',

    // Supabase 명령어 메시지
    'supabase.installing': 'Installing Supabase...',
    'supabase.success': 'Supabase installed successfully',
    'supabase.error': 'Error installing Supabase',

    // Gtag 명령어 메시지
    'gtag.installing': 'Installing Google Analytics (gtag)...',
    'gtag.success': 'Google Analytics (gtag) installed successfully',
    'gtag.error': 'Error installing Google Analytics (gtag)',
    'gtag.id_required': 'Google Analytics ID is required',

    // Clarity 명령어 메시지
    'clarity.installing': 'Installing Microsoft Clarity...',
    'clarity.success': 'Microsoft Clarity installed successfully',
    'clarity.error': 'Error installing Microsoft Clarity',
    'clarity.id_required': 'Microsoft Clarity ID is required',

    // Channeltalk 명령어 메시지
    'channeltalk.installing': 'Installing Channel Talk...',
    'channeltalk.success': 'Channel Talk installed successfully',
    'channeltalk.error': 'Error installing Channel Talk',
    'channeltalk.id_required': 'Channel Talk ID is required',

    // Sentry 명령어 메시지
    'sentry.installing': 'Installing Sentry...',
    'sentry.success': 'Sentry installed successfully',
    'sentry.error': 'Error installing Sentry',
    'sentry.dsn_required': 'Sentry DSN is required',

    // i18n 명령어 메시지
    'i18n.setup_start': 'Setting up i18n for Next.js...',
    'i18n.no_app_dir':
      'No app directory found. Please run this command in a Next.js project.',
    'i18n.setup_complete': 'i18n setup completed successfully',
    'i18n.config_created': 'Next.js i18n config created',
    'i18n.language_files_created': 'Language files created',
    'i18n.page_updated': 'Home page updated with language switcher',
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

    // Version 명령어 메시지
    'version.current': '현재 버전:',

    // Login 명령어 메시지
    'login.success': '로그인 성공',
    'login.token_saved': '토큰이 성공적으로 저장되었습니다',
    'login.invalid_token': '유효하지 않은 토큰입니다',
    'login.token_required': '토큰이 필요합니다',

    // Auth 명령어 메시지
    'auth.logged_in': '로그인된 계정:',
    'auth.not_logged_in': '로그인되어 있지 않습니다',
    'auth.logout_success': '로그아웃 되었습니다',

    // Doctor 명령어 메시지
    'doctor.checking': '시스템을 확인하는 중...',
    'doctor.node_version': 'Node.js 버전:',
    'doctor.npm_version': 'npm 버전:',
    'doctor.yarn_version': 'Yarn 버전:',
    'doctor.pnpm_version': 'pnpm 버전:',
    'doctor.git_version': 'Git 버전:',
    'doctor.os': '운영체제:',
    'doctor.cpu': 'CPU:',
    'doctor.memory': '메모리:',
    'doctor.all_good': '모든 검사가 통과되었습니다!',
    'doctor.issues_found': '발견된 문제:',

    // Supabase 명령어 메시지
    'supabase.installing': 'Supabase 설치 중...',
    'supabase.success': 'Supabase가 성공적으로 설치되었습니다',
    'supabase.error': 'Supabase 설치 중 오류가 발생했습니다',

    // Gtag 명령어 메시지
    'gtag.installing': 'Google Analytics (gtag) 설치 중...',
    'gtag.success': 'Google Analytics (gtag)가 성공적으로 설치되었습니다',
    'gtag.error': 'Google Analytics (gtag) 설치 중 오류가 발생했습니다',
    'gtag.id_required': 'Google Analytics ID가 필요합니다',

    // Clarity 명령어 메시지
    'clarity.installing': 'Microsoft Clarity 설치 중...',
    'clarity.success': 'Microsoft Clarity가 성공적으로 설치되었습니다',
    'clarity.error': 'Microsoft Clarity 설치 중 오류가 발생했습니다',
    'clarity.id_required': 'Microsoft Clarity ID가 필요합니다',

    // Channeltalk 명령어 메시지
    'channeltalk.installing': 'Channel Talk 설치 중...',
    'channeltalk.success': 'Channel Talk가 성공적으로 설치되었습니다',
    'channeltalk.error': 'Channel Talk 설치 중 오류가 발생했습니다',
    'channeltalk.id_required': 'Channel Talk ID가 필요합니다',

    // Sentry 명령어 메시지
    'sentry.installing': 'Sentry 설치 중...',
    'sentry.success': 'Sentry가 성공적으로 설치되었습니다',
    'sentry.error': 'Sentry 설치 중 오류가 발생했습니다',
    'sentry.dsn_required': 'Sentry DSN이 필요합니다',

    // i18n 명령어 메시지
    'i18n.setup_start': 'Next.js i18n 설정을 시작합니다...',
    'i18n.no_app_dir':
      'app 디렉토리를 찾을 수 없습니다. Next.js 프로젝트에서 실행해주세요.',
    'i18n.setup_complete': 'i18n 설정이 성공적으로 완료되었습니다',
    'i18n.config_created': 'Next.js i18n 설정 파일이 생성되었습니다',
    'i18n.language_files_created': '언어 파일이 생성되었습니다',
    'i18n.page_updated': '홈 페이지에 언어 변경 버튼이 추가되었습니다',
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

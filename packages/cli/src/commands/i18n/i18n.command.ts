import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import output from '@/output-manager';
import { GlobalConfig } from '@/global/config/global.config';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import i18n from '@/util/i18n';

@Command({
  name: 'i18n',
  description: 'Setup i18n for Next.js',
})
export class I18nCommand extends AbstractCommand {
  constructor(private config: GlobalConfig) {
    super();
  }

  async run() {
    output.info(i18n.t('i18n.setup_start'));

    // 1. app 디렉토리 확인 및 생성
    const appDir = join(process.cwd(), 'src', 'app');
    if (!existsSync(appDir)) {
      output.error(i18n.t('i18n.no_app_dir'));
      return;
    }

    // 4. i18n 라이브러리 생성
    this.createI18nLib();

    // 5. i18n 훅 생성
    this.createI18nHook();

    // 4. 예시 페이지 수정
    this.createI18NPage();

    output.success(i18n.t('i18n.setup_complete'));
  }

  private createI18nLib() {
    const libDir = join(process.cwd(), 'src', 'lib');
    if (!existsSync(libDir)) {
      mkdirSync(libDir);
    }

    const libFilePath = join(libDir, 'i18n.ts');
    const libContent = `// 지원하는 로케일 목록
export const locales = ["ko", "en"];

// 기본 로케일
export const defaultLocale = "en";

// 로컬스토리지 키
const LOCALE_STORAGE_KEY = "app_locale";

// 번역 데이터
export const translations = {
  ko: {
    welcome: "환영합니다",
    hello: "안녕하세요",
    change_language: "언어 변경",
    description: "Next.js 다국어 지원 예시입니다",
    current_locale: "현재 언어",
  },
  en: {
    welcome: "Welcome",
    hello: "Hello",
    change_language: "Change Language",
    description: "Next.js i18n example",
    current_locale: "Current locale",
  },
};

export type Locale = keyof typeof translations;

// 현재 로케일 가져오기 (클라이언트 사이드)
export function getClientLocale(): Locale {
  if (typeof window === "undefined") {
    return defaultLocale as Locale;
  }

  // 로컬스토리지에서 로케일 가져오기
  const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);

  // 저장된 로케일이 유효한지 확인
  if (storedLocale && locales.includes(storedLocale)) {
    return storedLocale as Locale;
  }

  // 저장된 로케일이 없거나 유효하지 않은 경우 기본 로케일 반환
  return defaultLocale as Locale;
}

// 로케일 설정 (클라이언트 사이드)
export function setClientLocale(locale: Locale): void {
  if (typeof window === "undefined") {
    return;
  }

  // 로컬스토리지에 로케일 저장
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

// 번역 함수
export function translate(
  key: keyof typeof translations.ko,
  locale: Locale = getClientLocale()
): string {
  return translations[locale][key] || key;
}

// 쿠키에서 로케일 가져오기 (서버 사이드)
export function getLocaleFromCookie(cookie: string): Locale {
  const match = cookie.match(new RegExp(\`\${LOCALE_STORAGE_KEY}=([^;]+)\`));
  const locale = match ? match[1] : defaultLocale;
  return (locales.includes(locale) ? locale : defaultLocale) as Locale;
}
`;

    writeFileSync(libFilePath, libContent);
  }

  private createI18nHook() {
    const hookDir = join(process.cwd(), 'src', 'hooks');
    if (!existsSync(hookDir)) {
      mkdirSync(hookDir);
    }

    const hookFilePath = join(hookDir, 'useI18n.ts');
    const hookContent = `"use client";

import { useState, useEffect } from "react";
import {
  translations,
  getClientLocale,
  setClientLocale,
  Locale,
  translate as translateFn,
} from "@/lib/i18n";

export function useI18n() {
  const [locale, setLocale] = useState<Locale>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    const currentLocale = getClientLocale();
    setLocale(currentLocale);
    setIsLoaded(true);
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setClientLocale(newLocale);
    setLocale(newLocale);
  };

  const translate = (key: keyof typeof translations.ko) => {
    return translateFn(key, locale);
  };

  return {
    locale,
    isLoaded,
    changeLocale,
    translate,
    t: translations[locale] || translations.en,
  };
}

`;

    writeFileSync(hookFilePath, hookContent);
  }

  private createI18NPage() {
    const pageDir = join(process.cwd(), 'src', 'app', 'i18n');
    if (!existsSync(pageDir)) {
      mkdirSync(pageDir);
    }

    const pageFilePath = join(pageDir, 'page.tsx');

    const pageContent = `"use client";

import { useI18n } from "@/hooks/useI18n";

export default function I18NPage() {
  const { locale, t, changeLocale, isLoaded } = useI18n();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-6">{t.welcome}</h1>
        <p className="mb-4">{t.hello}</p>
        <p className="mb-4">{t.description}</p>
        <p className="mb-4">
          {t.current_locale}: <strong>{locale}</strong>
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">{t.change_language}</h2>
          <div className="flex gap-4">
            <button
              onClick={() => changeLocale("ko")}
              className={\`px-4 py-2 rounded \${
                locale === "ko" ? "bg-blue-500 text-white" : "bg-gray-200"
              }\`}
            >
              한국어
            </button>
            <button
              onClick={() => changeLocale("en")}
              className={\`px-4 py-2 rounded \${
                locale === "en" ? "bg-blue-500 text-white" : "bg-gray-200"
              }\`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

`;

    writeFileSync(pageFilePath, pageContent);
    output.success(i18n.t('i18n.page_updated'));
  }
}

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
    const appDir = join(process.cwd(), 'app');
    if (!existsSync(appDir)) {
      output.error(i18n.t('i18n.no_app_dir'));
      return;
    }

    // 2. i18n 설정 파일 생성
    this.createI18nConfig();

    // 3. 언어 파일 생성
    this.createLanguageFiles();

    // 4. 예시 페이지 수정
    this.updateHomePage();

    output.success(i18n.t('i18n.setup_complete'));
  }

  private createI18nConfig() {
    const nextConfigPath = join(process.cwd(), 'next.config.js');

    let configContent = '';
    if (existsSync(nextConfigPath)) {
      configContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
  },
}

module.exports = nextConfig
`;
    } else {
      configContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
  },
}

module.exports = nextConfig
`;
    }

    writeFileSync(nextConfigPath, configContent);
    output.success(i18n.t('i18n.config_created'));
  }

  private createLanguageFiles() {
    // 언어 파일 디렉토리 생성
    const localesDir = join(process.cwd(), 'locales');
    if (!existsSync(localesDir)) {
      mkdirSync(localesDir);
    }

    // 한국어 파일 생성
    const koDir = join(localesDir, 'ko');
    if (!existsSync(koDir)) {
      mkdirSync(koDir);
    }

    const koCommonContent = {
      welcome: '환영합니다',
      hello: '안녕하세요',
      change_language: '언어 변경',
      description: 'Next.js 다국어 지원 예시입니다',
      current_locale: '현재 언어',
    };

    writeFileSync(
      join(koDir, 'common.json'),
      JSON.stringify(koCommonContent, null, 2),
    );

    // 영어 파일 생성
    const enDir = join(localesDir, 'en');
    if (!existsSync(enDir)) {
      mkdirSync(enDir);
    }

    const enCommonContent = {
      welcome: 'Welcome',
      hello: 'Hello',
      change_language: 'Change Language',
      description: 'Next.js i18n example',
      current_locale: 'Current locale',
    };

    writeFileSync(
      join(enDir, 'common.json'),
      JSON.stringify(enCommonContent, null, 2),
    );

    output.success(i18n.t('i18n.language_files_created'));
  }

  private updateHomePage() {
    const pageFilePath = join(process.cwd(), 'app', 'page.tsx');

    const pageContent = `'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [locale, setLocale] = useState('');

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    setLocale(window.location.pathname.split('/')[1] || 'ko');
  }, []);

  const changeLanguage = (newLocale: string) => {
    const path = window.location.pathname.split('/').slice(2).join('/');
    router.push(\`/\${newLocale}/\${path}\`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-6">{t('welcome')}</h1>
        <p className="mb-4">{t('hello')}</p>
        <p className="mb-4">{t('description')}</p>
        <p className="mb-4">
          {t('current_locale')}: <strong>{locale}</strong>
        </p>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">{t('change_language')}</h2>
          <div className="flex gap-4">
            <button
              onClick={() => changeLanguage('ko')}
              className={\`px-4 py-2 rounded \${
                locale === 'ko' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }\`}
            >
              한국어
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={\`px-4 py-2 rounded \${
                locale === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
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

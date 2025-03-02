import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import * as fs from 'fs-extra';
import * as path from 'path';
import output from '../../output-manager';
import i18n from '@/util/i18n';
import { install } from '../create/helpers/install';
import { getOnline } from '../create/helpers/is-online';

@Command({
  name: 'gtag',
  description:
    'Google Analytics(GA4) 서비스 연동 코드를 Next.js 프로젝트에 추가합니다',
  aliases: ['analytics', 'ga'],
})
export class GtagCommand extends AbstractCommand {
  async run(): Promise<void> {
    try {
      // 현재 작업 디렉토리
      const cwd = process.cwd();

      // app 디렉토리 확인
      const appDir = path.join(cwd, 'src', 'app');
      if (!fs.existsSync(appDir)) {
        output.error(
          'Next.js app 디렉토리를 찾을 수 없습니다. Next.js 프로젝트 루트 디렉토리에서 실행해주세요.',
        );
        return;
      }

      // Google Analytics ID 입력 받기
      output.info(
        'Google Analytics(GA4) 측정 ID를 입력해주세요 (예: G-XXXXXXXXXX):',
      );
      const measurementId = await this.promptForInput();

      if (
        !measurementId ||
        !measurementId.trim() ||
        !measurementId.startsWith('G-')
      ) {
        output.error(i18n.t('gtag.id_required'));
        return;
      }

      // Google Analytics 스크립트 생성
      await this.createGoogleAnalyticsScript(cwd, measurementId);

      output.success(i18n.t('gtag.success'));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      output.error(`${i18n.t('gtag.error')}: ${errorMessage}`);
    }
  }

  private async promptForInput(): Promise<string> {
    return new Promise((resolve) => {
      process.stdin.resume();
      process.stdin.setEncoding('utf8');

      process.stdin.on('data', (data) => {
        process.stdin.pause();
        resolve(data.toString().trim());
      });
    });
  }

  private async createGoogleAnalyticsScript(
    cwd: string,
    measurementId: string,
  ): Promise<void> {
    // 1. app 디렉토리에 gtag.js 파일 생성
    const gtagFilePath = path.join(cwd, 'src', 'app', 'gtag.ts');
    const gtagContent = `'use client';

export const GA_MEASUREMENT_ID = '${measurementId}';

// Google Analytics 페이지뷰 추적
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Google Analytics 이벤트 추적
export const event = ({ action, category, label, value }: { action: string, category: string, label: string, value: number }) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
`;

    fs.writeFileSync(gtagFilePath, gtagContent);
    output.info(`✅ app/gtag.js 파일이 생성되었습니다.`);

    // 2. app/layout.js 또는 app/layout.tsx 파일 수정
    const layoutTsxPath = path.join(cwd, 'src', 'app', 'layout.tsx');
    const layoutJsPath = path.join(cwd, 'src', 'app', 'layout.js');

    let layoutPath;
    if (fs.existsSync(layoutTsxPath)) {
      layoutPath = layoutTsxPath;
    } else if (fs.existsSync(layoutJsPath)) {
      layoutPath = layoutJsPath;
    } else {
      output.error(
        'src/app/layout.tsx 또는 src/app/layout.js 파일을 찾을 수 없습니다.',
      );
      return;
    }

    // 레이아웃 파일 읽기
    let layoutContent = fs.readFileSync(layoutPath, 'utf8');

    // Google Analytics 스크립트 추가
    const gaScriptContent = `
  {/* Google Analytics */}
  <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />`;

    // import 문 추가
    if (
      !layoutContent.includes(
        "import { GoogleAnalytics } from '@next/third-parties/google'",
      )
    ) {
      layoutContent = layoutContent.replace(
        /import/,
        "import { GoogleAnalytics } from '@next/third-parties/google'\nimport { GA_MEASUREMENT_ID } from './gtag';\nimport",
      );
    } else if (!layoutContent.includes('import { GA_MEASUREMENT_ID }')) {
      layoutContent = layoutContent.replace(
        /import { GoogleAnalytics } from '@next\/third-parties\/google'/,
        "import { GoogleAnalytics } from '@next/third-parties/google';\nimport { GA_MEASUREMENT_ID } from './gtag'",
      );
    }

    const packageJsonPath = path.join(process.cwd(), 'package.json');

    // @next/third-parties 패키지 추가
    const packageJson = fs.readJsonSync(packageJsonPath);
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }

    if (!packageJson.dependencies['@next/third-parties']) {
      packageJson.dependencies['@next/third-parties'] = '15.2.0';
      fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
    } else {
      output.warn('@next/third-parties 패키지 중복');
    }

    const isOnline = await getOnline();
    await install('npm', isOnline);

    // body 태그 내에 스크립트 추가
    if (layoutContent.includes('</head>')) {
      // head 태그가 있는 경우 head 태그 닫기 전에 추가
      layoutContent = layoutContent.replace(
        '</head>',
        `${gaScriptContent}\n  </head>`,
      );
    } else if (layoutContent.includes('<body')) {
      // body 태그가 있는 경우 body 태그 열기 후에 추가
      layoutContent = layoutContent.replace(
        /<body[^>]*>/,
        (match) => `${match}${gaScriptContent}`,
      );
    } else {
      output.warn(
        'layout 파일에 head 또는 body 태그를 찾을 수 없습니다. 수동으로 Google Analytics 스크립트를 추가해주세요.',
      );
    }

    // 수정된 레이아웃 파일 저장
    fs.writeFileSync(layoutPath, layoutContent);
    output.info(`✅ ${path.basename(layoutPath)} 파일이 수정되었습니다.`);

    // 4. README.md 파일에 사용법 추가
    const readmePath = path.join(cwd, 'README.md');
    if (fs.existsSync(readmePath)) {
      let readmeContent = fs.readFileSync(readmePath, 'utf8');

      const gaUsageContent = `
## Google Analytics 사용법

이 프로젝트는 Google Analytics(GA4)가 설정되어 있습니다. 측정 ID: \`${measurementId}\`

### 페이지 추적
페이지 추적은 자동으로 설정되어 있습니다.

### 이벤트 추적
이벤트를 추적하려면 다음과 같이 사용하세요:

\`\`\`javascript
import { event } from './app/gtag';

// 이벤트 추적
event({
  action: '버튼_클릭',
  category: '사용자_상호작용',
  label: '로그인_버튼',
  value: 1
});
\`\`\`
`;

      readmeContent += gaUsageContent;
      fs.writeFileSync(readmePath, readmeContent);
      output.info(
        '✅ README.md 파일에 Google Analytics 사용법이 추가되었습니다.',
      );
    }
  }
}

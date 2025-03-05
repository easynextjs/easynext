import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import * as fs from 'fs';
import * as path from 'path';
import output from '../../output-manager';
import i18n from '@/util/i18n';

@Command({
  name: 'clarity',
  description:
    'Microsoft Clarity 서비스 연동 코드를 Next.js 프로젝트에 추가합니다',
  aliases: ['ms-clarity'],
})
export class ClarityCommand extends AbstractCommand {
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

      // Microsoft Clarity 프로젝트 ID 입력 받기
      output.info('Microsoft Clarity 프로젝트 ID를 입력해주세요:');
      const clarityProjectId = await this.promptForInput();

      if (!clarityProjectId || !clarityProjectId.trim()) {
        output.error(i18n.t('clarity.id_required'));
        return;
      }

      // Microsoft Clarity 스크립트 생성
      await this.createMicrosoftClarityScript(cwd, clarityProjectId);

      output.success(i18n.t('clarity.success'));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      output.error(`${i18n.t('clarity.error')}: ${errorMessage}`);
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

  private async createMicrosoftClarityScript(
    cwd: string,
    clarityProjectId: string,
  ): Promise<void> {
    // 1. src/third-parties 디렉토리에 Clarity.tsx 파일 생성
    const thirdPartiesDir = path.join(cwd, 'src', 'third-parties');
    if (!fs.existsSync(thirdPartiesDir)) {
      fs.mkdirSync(thirdPartiesDir, { recursive: true });
    }

    const clarityFilePath = path.join(thirdPartiesDir, 'Clarity.tsx');
    const clarityContent = `'use client';

import Script from 'next/script';

export const CLARITY_PROJECT_ID = '${clarityProjectId}';

export default function Clarity() {
  return (
    <Script
      id="clarity-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: \`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityProjectId}");
        \`,
      }}
    />
  );
}

// Microsoft Clarity 초기화 함수
export const initClarity = () => {
  if (typeof window !== 'undefined' && typeof window.clarity === 'undefined') {
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments) };
  }
};
`;

    fs.writeFileSync(clarityFilePath, clarityContent);
    output.info(`✅ src/third-parties/Clarity.tsx 파일이 생성되었습니다.`);

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

    // Clarity 컴포넌트 import 추가
    if (
      !layoutContent.includes("import Clarity from '@/third-parties/Clarity'")
    ) {
      layoutContent = layoutContent.replace(
        /import/,
        "import Clarity from '@/third-parties/Clarity';\nimport",
      );
    }

    // Clarity 컴포넌트 추가
    if (layoutContent.includes('</head>')) {
      // head 태그가 있는 경우 head 태그 닫기 전에 추가
      layoutContent = layoutContent.replace(
        '</head>',
        `    <Clarity />\n  </head>`,
      );
    } else if (layoutContent.includes('<body')) {
      // body 태그가 있는 경우 body 태그 열기 후에 추가
      layoutContent = layoutContent.replace(
        /<body[^>]*>/,
        (match) => `${match}\n    <Clarity />`,
      );
    } else {
      output.warn(
        'layout 파일에 head 또는 body 태그를 찾을 수 없습니다. 수동으로 Clarity 컴포넌트를 추가해주세요.',
      );
    }

    // 수정된 레이아웃 파일 저장
    fs.writeFileSync(layoutPath, layoutContent);
    output.info(`✅ ${path.basename(layoutPath)} 파일이 수정되었습니다.`);

    // 3. types/global.d.ts 파일 생성 또는 수정
    const typesDir = path.join(cwd, 'src', 'types');
    if (!fs.existsSync(typesDir)) {
      fs.mkdirSync(typesDir, { recursive: true });
    }

    const globalDtsPath = path.join(typesDir, 'global.d.ts');
    let globalDtsContent = '';

    if (fs.existsSync(globalDtsPath)) {
      globalDtsContent = fs.readFileSync(globalDtsPath, 'utf8');
    }

    // Clarity 타입 정의 추가
    if (!globalDtsContent.includes('interface Window')) {
      globalDtsContent += `
interface Window {
  clarity: any;
}
`;
    } else if (!globalDtsContent.includes('clarity: any')) {
      // Window 인터페이스가 이미 있는 경우 clarity 속성만 추가
      globalDtsContent = globalDtsContent.replace(
        /interface Window \{/,
        'interface Window {\n  clarity: any;',
      );
    }

    fs.writeFileSync(globalDtsPath, globalDtsContent);
    output.info(`✅ types/global.d.ts 파일이 수정되었습니다.`);

    // 4. README.md 파일에 사용법 추가
    const readmePath = path.join(cwd, 'README.md');
    if (fs.existsSync(readmePath)) {
      let readmeContent = fs.readFileSync(readmePath, 'utf8');

      const clarityUsageContent = `
## Microsoft Clarity 사용법

이 프로젝트는 Microsoft Clarity가 설정되어 있습니다. 프로젝트 ID: \`${clarityProjectId}\`

Microsoft Clarity는 사용자 행동 분석 도구로, 별도의 코드 없이 자동으로 사용자 세션을 기록하고 히트맵, 세션 재생 등의 기능을 제공합니다.

Clarity 컴포넌트는 \`src/third-parties/Clarity.tsx\`에 위치하며, \`layout.tsx\`에 자동으로 추가되었습니다.

자세한 내용은 [Microsoft Clarity 공식 문서](https://docs.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup)를 참조하세요.
`;

      readmeContent += clarityUsageContent;
      fs.writeFileSync(readmePath, readmeContent);
      output.info(
        '✅ README.md 파일에 Microsoft Clarity 사용법이 추가되었습니다.',
      );
    }
  }
}

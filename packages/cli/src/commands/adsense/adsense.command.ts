import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import * as fs from 'fs';
import * as path from 'path';
import output from '../../output-manager';

@Command({
  name: 'adsense',
  description: 'Google AdSense 연동 코드를 생성합니다.',
})
export class AdsenseCommand extends AbstractCommand {
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

      // AdSense 프로젝트 ID 입력 받기
      output.info(
        'Google AdSense 클라이언트 ID를 입력해주세요 (예: ca-pub-1234567890123456):',
      );
      const adsenseId = await this.promptForInput();

      if (!adsenseId || !adsenseId.trim()) {
        output.error('Google AdSense 클라이언트 ID가 필요합니다.');
        return;
      }

      // AdSense 스크립트 생성
      await this.createAdsenseScript(cwd, adsenseId);

      // layout 파일에 AdSense 컴포넌트 추가
      await this.addAdsenseToLayout(cwd);

      output.success('Google AdSense 연동 설정이 완료되었습니다.');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      output.error(`AdSense 설정 중 오류가 발생했습니다: ${errorMessage}`);
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

  private async createAdsenseScript(
    cwd: string,
    adsenseId: string,
  ): Promise<void> {
    try {
      output.info('AdSense 스크립트 파일을 생성하는 중...');

      // 1. src/third-parties 디렉토리에 AdSense.tsx 파일 생성
      const thirdPartiesDir = path.join(cwd, 'src', 'third-parties');
      if (!fs.existsSync(thirdPartiesDir)) {
        fs.mkdirSync(thirdPartiesDir, { recursive: true });
      }

      const adsenseFilePath = path.join(thirdPartiesDir, 'AdSense.tsx');
      const adsenseContent = `'use client';

import Script from 'next/script';

export const ADSENSE_CLIENT_ID = '${adsenseId}';

export default function AdSense() {
  // 프로덕션 환경에서만 스크립트 로드
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      <script
        async
        src={\`"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=\${ADSENSE_CLIENT_ID}"\`}
        crossOrigin="anonymous"
      ></script>
    </>
  );
}

// AdSense 광고 컴포넌트
export function AdSenseAd({ slot, style = {} }: { slot: string; style?: React.CSSProperties }) {
  // 프로덕션 환경에서만 광고 표시
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <div style={{ display: 'block', textAlign: 'center', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id={\`adsense-ad-\${slot}\`} strategy="afterInteractive">
        {
          \`(adsbygoogle = window.adsbygoogle || []).push({});\`
        }
      </Script>
    </div>
  );
}
`;

      fs.writeFileSync(adsenseFilePath, adsenseContent);
      output.info('✅ src/third-parties/AdSense.tsx 파일이 생성되었습니다.');

      // 2. types/global.d.ts 파일 생성 또는 수정
      const typesDir = path.join(cwd, 'src', 'types');
      if (!fs.existsSync(typesDir)) {
        fs.mkdirSync(typesDir, { recursive: true });
      }

      const globalDtsPath = path.join(typesDir, 'global.d.ts');
      let globalDtsContent = '';

      if (fs.existsSync(globalDtsPath)) {
        globalDtsContent = fs.readFileSync(globalDtsPath, 'utf8');
      }

      // adsbygoogle 타입 정의 추가
      if (!globalDtsContent.includes('interface Window')) {
        globalDtsContent += `
interface Window {
  adsbygoogle: any[];
}
`;
      } else if (!globalDtsContent.includes('adsbygoogle: any')) {
        // Window 인터페이스가 이미 있는 경우 adsbygoogle 속성만 추가
        globalDtsContent = globalDtsContent.replace(
          /interface Window \{/,
          'interface Window {\n  adsbygoogle: any[];',
        );
      }

      fs.writeFileSync(globalDtsPath, globalDtsContent);
      output.info('✅ types/global.d.ts 파일이 수정되었습니다.');

      // 3. README.md 파일에 사용법 추가
      this.updateReadme(cwd, adsenseId);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      throw new Error(
        `AdSense 스크립트 생성 중 오류가 발생했습니다: ${errorMessage}`,
      );
    }
  }

  private async addAdsenseToLayout(cwd: string): Promise<void> {
    try {
      output.info('layout 파일에 AdSense 컴포넌트를 추가하는 중...');

      // app/layout.js 또는 app/layout.tsx 파일 수정
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

      // AdSense 컴포넌트 import 추가
      if (
        !layoutContent.includes("import AdSense from '@/third-parties/AdSense'")
      ) {
        layoutContent = layoutContent.replace(
          /import/,
          "import AdSense from '@/third-parties/AdSense';\nimport",
        );
      }

      // AdSense 컴포넌트 추가
      if (layoutContent.includes('</head>')) {
        // head 태그가 있는 경우 head 태그 닫기 전에 추가
        layoutContent = layoutContent.replace(
          '</head>',
          `    <AdSense />\n  </head>`,
        );
      } else if (layoutContent.includes('<body')) {
        // body 태그가 있는 경우 body 태그 열기 후에 추가
        layoutContent = layoutContent.replace(
          /<body[^>]*>/,
          (match) => `${match}\n    <AdSense />`,
        );
      } else {
        output.warn(
          'layout 파일에 head 또는 body 태그를 찾을 수 없습니다. 수동으로 AdSense 컴포넌트를 추가해주세요.',
        );
      }

      // 수정된 레이아웃 파일 저장
      fs.writeFileSync(layoutPath, layoutContent);
      output.info(`✅ ${path.basename(layoutPath)} 파일이 수정되었습니다.`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      throw new Error(
        `layout 파일 수정 중 오류가 발생했습니다: ${errorMessage}`,
      );
    }
  }

  private updateReadme(cwd: string, adsenseId: string): void {
    try {
      const readmePath = path.join(cwd, 'README.md');

      if (fs.existsSync(readmePath)) {
        let readmeContent = fs.readFileSync(readmePath, 'utf8');

        const adsenseUsageContent = `
## Google AdSense 사용법

이 프로젝트는 Google AdSense가 설정되어 있습니다. 클라이언트 ID: \`${adsenseId}\`

### 기본 설정
- AdSense 스크립트는 \`src/third-parties/AdSense.tsx\`에 위치하며, \`layout.tsx\`에 자동으로 추가되었습니다.
- 이 설정으로 Google AdSense 크롤러가 사이트를 분석할 수 있습니다.
- **참고**: AdSense 스크립트와 광고는 프로덕션 환경(\`NODE_ENV=production\`)에서만 로드됩니다.

### 광고 삽입 방법
특정 위치에 광고를 삽입하려면 다음과 같이 사용하세요:

\`\`\`tsx
import { AdSenseAd } from '@/third-parties/AdSense';

export default function MyPage() {
  return (
    <div>
      <h1>페이지 제목</h1>
      {/* 광고 슬롯 ID를 지정하여 광고 삽입 */}
      <AdSenseAd slot="1234567890" />
      <p>페이지 내용...</p>
    </div>
  );
}
\`\`\`

자세한 내용은 [Google AdSense 공식 문서](https://support.google.com/adsense/answer/9274025)를 참조하세요.
`;

        if (!readmeContent.includes('## Google AdSense 사용법')) {
          readmeContent += adsenseUsageContent;
          fs.writeFileSync(readmePath, readmeContent);
          output.info(
            'README.md 파일에 Google AdSense 사용법이 추가되었습니다.',
          );
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      output.warn(`README.md 업데이트 중 오류가 발생했습니다: ${errorMessage}`);
    }
  }
}

import * as fs from 'fs-extra';
import * as path from 'path';
import output from '../../../output-manager';

export function initSupabase() {
  try {
    // 1. package.json 확인
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      output.error(
        'package.json을 찾을 수 없습니다. 프로젝트 루트 디렉토리에서 실행해주세요.',
      );
      process.exit(1);
    }

    // 2. @supabase/ssr 패키지 추가
    const packageJson = fs.readJsonSync(packageJsonPath);
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }

    if (!packageJson.dependencies['@supabase/ssr']) {
      packageJson.dependencies['@supabase/ssr'] = '^0.0.10';
      output.info('@supabase/ssr 패키지를 dependencies에 추가합니다.');
      fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
    } else {
      output.info('@supabase/ssr 패키지가 이미 설치되어 있습니다.');
    }

    // 3. .env.local 파일 확인 및 생성
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // 필요한 환경 변수 추가
    const envVars = [
      'NEXT_PUBLIC_SUPABASE_URL=your-supabase-url',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key',
    ];

    let envUpdated = false;
    for (const envVar of envVars) {
      const varName = envVar.split('=')[0];
      if (!envContent.includes(varName)) {
        envContent +=
          envContent.endsWith('\n') || envContent === '' ? '' : '\n';
        envContent += `${envVar}\n`;
        envUpdated = true;
      }
    }

    if (envUpdated) {
      fs.writeFileSync(envPath, envContent);
      output.info('.env.local 파일에 Supabase 환경 변수를 추가했습니다.');
    } else {
      output.info('Supabase 환경 변수가 이미 .env.local 파일에 존재합니다.');
    }

    // 4. src/lib/supabase 디렉토리 생성
    const supabaseDirPath = path.join(process.cwd(), 'src', 'lib', 'supabase');
    fs.ensureDirSync(supabaseDirPath);

    // client.ts 파일 생성
    const clientFilePath = path.join(supabaseDirPath, 'client.ts');
    if (!fs.existsSync(clientFilePath)) {
      const clientContent = `import { createBrowserClient } from '@supabase/ssr'
  
  export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  `;
      fs.writeFileSync(clientFilePath, clientContent);
      output.info('src/lib/supabase/client.ts 파일을 생성했습니다.');
    } else {
      output.info('src/lib/supabase/client.ts 파일이 이미 존재합니다.');
    }

    // server.ts 파일 생성
    const serverFilePath = path.join(supabaseDirPath, 'server.ts');
    if (!fs.existsSync(serverFilePath)) {
      const serverContent = `import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'
  
  export function createClient() {
    const cookieStore = cookies()
  
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
  }
  `;
      fs.writeFileSync(serverFilePath, serverContent);
      output.info('src/lib/supabase/server.ts 파일을 생성했습니다.');
    } else {
      output.info('src/lib/supabase/server.ts 파일이 이미 존재합니다.');
    }

    output.success('Supabase 설정이 완료되었습니다!');
    output.info('다음 명령어로 패키지를 설치하세요:');
    output.info('npm install 또는 yarn install 또는 pnpm install');
    output.info(
      '그리고 .env.local 파일에서 Supabase URL과 Anon Key를 설정하세요.',
    );
  } catch (error) {
    output.error('Supabase 설정 중 오류가 발생했습니다:');
    output.error(
      error instanceof Error ? error.message : JSON.stringify(error),
    );
    process.exit(1);
  }
}

import * as fs from 'fs-extra';
import * as path from 'path';
import output from '../../../output-manager';
import { install } from '@/commands/create/helpers/install';
import { getOnline } from '@/commands/create/helpers/is-online';

export async function initAuth() {
  try {
    // 현재 디렉토리가 프로젝트 루트인지 확인
    const packageJsonPath = path.join(process.cwd(), 'package.json');

    // 1. next-auth 패키지 추가
    const packageJson = fs.readJsonSync(packageJsonPath);
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }

    if (!packageJson.dependencies['next-auth']) {
      packageJson.dependencies['next-auth'] = '^4.24.5';
      fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
    } else {
      output.warn('next-auth 패키지가 이미 설치되어 있습니다.');
    }

    // 2. .env.local 파일 확인 및 생성
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // 필요한 환경 변수 추가
    const envVars = [
      'NEXTAUTH_URL=http://localhost:3000',
      'NEXTAUTH_SECRET=your-nextauth-secret',
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
    } else {
      output.warn('.env.local 파일 환경 변수가 이미 설정되어 있습니다.');
    }

    // 3. src/app/api/auth/[...nextauth]/route.ts 파일 생성
    const authDirPath = path.join(
      process.cwd(),
      'src',
      'app',
      'api',
      'auth',
      '[...nextauth]',
    );
    fs.ensureDirSync(authDirPath);

    const authRoutePath = path.join(authDirPath, 'route.ts');
    if (!fs.existsSync(authRoutePath)) {
      fs.writeFileSync(authRoutePath, authRouteContent);
    } else {
      output.warn('src/app/api/auth/[...nextauth]/route.ts 중복');
    }

    // 4. src/lib/auth.ts 파일 생성
    const authLibDirPath = path.join(process.cwd(), 'src', 'lib');
    fs.ensureDirSync(authLibDirPath);

    const authLibPath = path.join(authLibDirPath, 'auth.ts');
    if (!fs.existsSync(authLibPath)) {
      fs.writeFileSync(authLibPath, authLibContent);
    } else {
      output.warn('src/lib/auth.ts 중복');
    }

    // 5. src/components/auth/auth-provider.tsx 파일 생성
    const authComponentsDirPath = path.join(
      process.cwd(),
      'src',
      'components',
      'auth',
    );
    fs.ensureDirSync(authComponentsDirPath);

    const authProviderPath = path.join(
      authComponentsDirPath,
      'auth-provider.tsx',
    );
    if (!fs.existsSync(authProviderPath)) {
      fs.writeFileSync(authProviderPath, authProviderContent);
    } else {
      output.warn('src/components/auth/auth-provider.tsx 중복');
    }

    // 6. src/app/layout.tsx 파일 수정 (AuthProvider 추가)
    const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
    if (fs.existsSync(layoutPath)) {
      let layoutContent = fs.readFileSync(layoutPath, 'utf8');

      // AuthProvider가 이미 추가되어 있는지 확인
      if (!layoutContent.includes('AuthProvider')) {
        // import 추가
        if (!layoutContent.includes('import { AuthProvider }')) {
          const importStatement =
            "import { AuthProvider } from '@/components/auth/auth-provider';\n";

          // 마지막 import 문 찾기
          const lastImportIndex = layoutContent.lastIndexOf('import');
          const lastImportLineEnd =
            layoutContent.indexOf('\n', lastImportIndex) + 1;

          layoutContent =
            layoutContent.substring(0, lastImportLineEnd) +
            importStatement +
            layoutContent.substring(lastImportLineEnd);
        }

        // children을 AuthProvider로 감싸기
        const childrenPattern =
          /<body[^>]*>([\s\S]*?){children}([\s\S]*?)<\/body>/;
        if (childrenPattern.test(layoutContent)) {
          layoutContent = layoutContent.replace(
            childrenPattern,
            (match, before, after) =>
              `<body${match.match(/<body([^>]*)>/)[1]}>` +
              `${before}<AuthProvider>{children}</AuthProvider>${after}` +
              `</body>`,
          );

          fs.writeFileSync(layoutPath, layoutContent);
        } else {
          output.warn(
            'layout.tsx 파일에 AuthProvider를 자동으로 추가할 수 없습니다. 수동으로 추가해주세요.',
          );
        }
      } else {
        output.warn('layout.tsx 파일에 AuthProvider가 이미 추가되어 있습니다.');
      }
    } else {
      output.warn(
        'src/app/layout.tsx 파일을 찾을 수 없습니다. AuthProvider를 수동으로 추가해주세요.',
      );
    }

    // 7. auth rules 파일 생성
    const rulesFilePath = path.join(
      process.cwd(),
      '.cursor',
      'rules',
      'auth.mdc',
    );
    if (!fs.existsSync(rulesFilePath)) {
      fs.ensureDirSync(path.dirname(rulesFilePath));
      fs.writeFileSync(rulesFilePath, authRules);
    } else {
      output.warn('.cursor/rules/auth.mdc 중복');
    }

    // 패키지 설치
    const isOnline = await getOnline();
    console.log('\n의존성 패키지 설치 중...');
    await install('npm', isOnline);

    output.success(
      'Next-Auth 설정이 완료되었습니다! .env.local 파일을 확인하고 인증 정보를 업데이트해주세요.',
    );
  } catch (error) {
    output.error('Next-Auth 설정 중 오류가 발생했습니다:');
    output.error(
      error instanceof Error ? error.message : JSON.stringify(error),
    );
    process.exit(1);
  }
}

const authRouteContent = `import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
`;

const authLibContent = `import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    // 제공자를 여기에 추가할 수 있습니다.
  ],
  pages: {
    signIn: "/auth/signin",
    // signOut: '/auth/signout',
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
    // newUser: '/auth/new-user'
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// 타입 확장
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
`;

const authProviderContent = `"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
`;

const authRules = `---
description: Next-Auth 인증 가이드라인
globs: src/app/api/auth/**/*.ts
---

# Next-Auth 인증 가이드라인

## 필수 사항
- 환경 변수는 .env.local 파일에 저장하고 버전 관리에서 제외해야 합니다.
- NEXTAUTH_SECRET은 안전하게 생성하고 관리해야 합니다.
- 프로덕션 환경에서는 NEXTAUTH_URL을 정확히 설정해야 합니다.
- 모든 인증 제공자의 콜백 URL을 올바르게 구성해야 합니다.

## 권장 사항
- 세션 관리에는 JWT 전략을 사용하는 것이 좋습니다.
- 사용자 정의 로그인 페이지를 만들어 더 나은 사용자 경험을 제공하세요.
- 인증 콜백을 활용하여 사용자 정보를 확장하세요.
- 다중 인증 제공자를 지원하도록 구성하세요.

## 보안 모범 사례
- NEXTAUTH_SECRET은 강력한 무작위 문자열을 사용하세요.
- 민감한 작업에는 CSRF 보호를 구현하세요.
- 세션 쿠키에 적절한 보안 설정을 사용하세요.
- 인증된 API 라우트에 적절한 권한 검사를 구현하세요.

## 디버깅 팁
- 개발 환경에서 DEBUG=next-auth* 환경 변수를 사용하여 자세한 로그를 확인하세요.
- 인증 오류 페이지를 사용자 정의하여 더 나은 오류 메시지를 제공하세요.
- 세션 만료 및 갱신 전략을 적절히 구성하세요.

## 확장 방법
- 사용자 정의 어댑터를 사용하여 데이터베이스와 통합하세요.
- 사용자 정의 인증 제공자를 구현하여 특별한 인증 요구 사항을 충족하세요.
- 미들웨어를 사용하여 페이지 및 API 라우트에 대한 액세스를 제어하세요.
`;

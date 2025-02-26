import * as fs from 'fs';
import * as path from 'path';
import output from '../../../output-manager';
import { assertRoot } from '@/util/check-root';

export async function addIdpw(): Promise<void> {
  assertRoot();

  // 필요한 파일들이 존재하는지 확인
  const authLibPath = path.join(process.cwd(), 'src', 'lib', 'auth.ts');

  if (!fs.existsSync(authLibPath)) {
    output.error(
      'Next-Auth가 초기화되지 않았습니다. 먼저 `easynext auth init` 명령어를 실행하세요.',
    );
    process.exit(1);
  }

  // auth.ts 파일 수정
  let authContent = fs.readFileSync(authLibPath, 'utf8');

  // CredentialsProvider가 이미 있는지 확인
  if (authContent.includes('CredentialsProvider')) {
    output.info('CredentialsProvider가 이미 설정되어 있습니다.');
    return;
  }

  // providers 배열에 CredentialsProvider 추가
  authContent = authContent.replace(
    'providers: [',
    `providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        id: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" }
      },
      async authorize(credentials) {
        // 실제 프로젝트에서는 DB 조회 등으로 대체해야 합니다
        const users = [
          { id: "admin", password: "admin1234", name: "관리자", email: "admin@example.com" },
          { id: "user", password: "user1234", name: "일반사용자", email: "user@example.com" }
        ];
        
        const user = users.find(user => 
          user.id === credentials?.id && 
          user.password === credentials?.password
        );
        
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email
          };
        }
        
        return null;
      }
    }),`,
  );

  // CredentialsProvider import 추가
  authContent = authContent.replace(
    'import { NextAuthOptions } from "next-auth";',
    'import { NextAuthOptions } from "next-auth";\nimport CredentialsProvider from "next-auth/providers/credentials";',
  );

  fs.writeFileSync(authLibPath, authContent);

  // 로그인 페이지 생성
  const loginPageDir = path.join(
    process.cwd(),
    'src',
    'app',
    'auth',
    'login-idpw',
  );
  if (!fs.existsSync(loginPageDir)) {
    fs.mkdirSync(loginPageDir, { recursive: true });
  }

  const loginPagePath = path.join(loginPageDir, 'page.tsx');
  const loginPageContent = `'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        id,
        password,
      });

      if (result?.error) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            아이디/비밀번호로 로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            테스트 계정: admin / admin1234 또는 user / user1234
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="id" className="sr-only">
                아이디
              </label>
              <input
                id="id"
                name="id"
                type="text"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="아이디"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
`;

  fs.writeFileSync(loginPagePath, loginPageContent);

  output.success('ID/비밀번호 인증이 성공적으로 추가되었습니다.');
  output.info('로그인 페이지: /src/app/auth/login-idpw/page.tsx');
  output.info('테스트 계정: admin / admin1234 또는 user / user1234');
}

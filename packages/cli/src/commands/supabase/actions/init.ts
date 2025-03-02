import * as fs from 'fs-extra';
import * as path from 'path';
import output from '../../../output-manager';
import { install } from '@/commands/create/helpers/install';
import { getOnline } from '@/commands/create/helpers/is-online';
import i18n from '@/util/i18n';

export async function initSupabase() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');

    // 2. @supabase/ssr 패키지 추가
    const packageJson = fs.readJsonSync(packageJsonPath);
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }

    if (!packageJson.dependencies['@supabase/ssr']) {
      packageJson.dependencies['@supabase/ssr'] = '0.5.2';
      fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
    } else {
      output.warn('@supabase/ssr 패키지 중복');
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
      'SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key',
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
      output.warn('.env.local 파일 환경 변수 중복');
    }

    // 4. src/lib/supabase 디렉토리 생성
    const supabaseDirPath = path.join(process.cwd(), 'src', 'lib', 'supabase');
    fs.ensureDirSync(supabaseDirPath);

    // client.ts 파일 생성
    const clientFilePath = path.join(supabaseDirPath, 'client.ts');
    if (!fs.existsSync(clientFilePath)) {
      fs.writeFileSync(clientFilePath, clientContent);
    } else {
      output.warn('src/lib/supabase/client.ts 중복');
    }

    // server.ts 파일 생성
    const serverFilePath = path.join(supabaseDirPath, 'server.ts');
    if (!fs.existsSync(serverFilePath)) {
      fs.writeFileSync(serverFilePath, serverContent);
    } else {
      output.warn('src/lib/supabase/server.ts 중복');
    }

    // 5. supabase/migrations 디렉토리 생성
    const migrationsDirPath = path.join(
      process.cwd(),
      'supabase',
      'migrations',
    );
    fs.ensureDirSync(migrationsDirPath);

    // 6. supabase rules 파일 생성
    const rulesFilePath = path.join(
      process.cwd(),
      '.cursor',
      'rules',
      'supabase.mdc',
    );
    if (!fs.existsSync(rulesFilePath)) {
      fs.writeFileSync(rulesFilePath, supabaseRules);
    } else {
      output.warn('.cursor/rules/supabase.mdc 중복');
    }

    const isOnline = await getOnline();
    console.log(`\n${i18n.t('supabase.installing')}`);
    await install('npm', isOnline);

    output.success(i18n.t('supabase.success'));
  } catch (error) {
    output.error(i18n.t('supabase.error'));
    output.error(
      error instanceof Error ? error.message : JSON.stringify(error),
    );
    process.exit(1);
  }
}

const clientContent = `import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
`;

const serverContent = `import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The \`setAll\` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function createPureClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}
`;

const supabaseRules = `---
description: Supabase Migration SQL Guideline
globs: supabase/migrations/*.sql
---

# Supabase Migration SQL Guideline

## Must
- Each migration file must have a unique name with number prefix (e.g., \`0001_create_users_table.sql\`)
- Each migration must be idempotent (can be run multiple times without error)
- Use \`CREATE TABLE IF NOT EXISTS\` instead of just \`CREATE TABLE\`
- Include proper error handling with \`BEGIN\` and \`EXCEPTION\` blocks
- Add comments for complex operations
- Always specify column types explicitly
- Include proper constraints (NOT NULL, UNIQUE, etc.) where appropriate
- Add updated_at column to all tables, and use trigger to update it
- always check other migrations to avoid conflicts

## Should
- Keep migrations small 
- Use consistent naming conventions for tables and columns
- Use snake_case for all identifiers
- Document breaking changes

## Recommended Patterns
- Use RLS (Row Level Security) for access control
- Set up proper indexes for frequently queried columns
- Use foreign key constraints to maintain referential integrity
- Leverage Postgres extensions when appropriate
- Use enums for fields with a fixed set of values
- Consider using views for complex queries

## Schema Organization
- Group related tables together
- Use schemas to organize tables by domain
- Consider using Postgres schemas for multi-tenant applications
- Keep authentication tables in the auth schema

## Performance Considerations
- Avoid adding/removing columns from large tables in production
- Use appropriate data types to minimize storage
- Add indexes strategically (not excessively)

## Security Best Practices
- Never store plaintext passwords
- Use RLS policies to restrict data access
- Sanitize all user inputs
`;

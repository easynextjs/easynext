import output from '@/output-manager';
import * as fs from 'fs-extra';
import * as path from 'path';

export function checkRoot() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  return fs.existsSync(packageJsonPath);
}

export function assertRoot() {
  if (!checkRoot()) {
    output.error(
      'package.json을 찾을 수 없습니다. 프로젝트 루트 디렉토리에서 실행해주세요.',
    );
    process.exit(1);
  }
}

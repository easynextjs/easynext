import * as fs from 'fs-extra';
import * as path from 'path';

export function checkRoot() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  return fs.existsSync(packageJsonPath);
}

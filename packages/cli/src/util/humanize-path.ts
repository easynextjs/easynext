import { homedir } from 'os';
import { resolve } from 'path';

export function hp(path: string) {
  const resolved = resolve(path);
  const _homedir = homedir();
  return resolved.indexOf(_homedir) === 0
    ? `~${resolved.slice(_homedir.length)}`
    : resolved;
}

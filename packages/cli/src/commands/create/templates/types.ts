import { PackageManager } from '../helpers/get-pkg-manager';

export type TemplateType = 'default';

export interface GetTemplateFileArgs {
  template: TemplateType;
  mode: 'ts';
  file: string;
}

export interface InstallTemplateArgs {
  appName: string;
  root: string;
  packageManager: PackageManager;
  isOnline: boolean;
  template: TemplateType;
  skipInstall: boolean;
  turbopack: boolean;
}

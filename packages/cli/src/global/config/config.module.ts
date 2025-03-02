import { errorToString, isErrnoException } from '@vercel/error-utils';

import { hp } from '@/util/humanize-path';
import { mkdirp } from 'fs-extra';
import getGlobalPathConfig from '@/util/config/global-path';
import * as configFiles from '@/util/config/files';
import { GlobalConfig } from '@/global/config/global.config';
import {
  defaultAuthConfig,
  defaultGlobalConfig,
} from '@/util/config/get-default';
import { AuthConfig } from '@/global/config/auth.config';
import output, { updateLanguage } from '@/output-manager';

const EASYNEXT_DIR = getGlobalPathConfig();
const EASYNEXT_CONFIG_PATH = configFiles.getConfigFilePath();
const EASYNEXT_AUTH_CONFIG_PATH = configFiles.getAuthConfigFilePath();

import { Module, Provider } from '@nestjs/common';

@Module({})
export class ConfigModule {
  static async forRootAsync() {
    try {
      await mkdirp(EASYNEXT_DIR);
    } catch (err: unknown) {
      output.error(
        `An unexpected error occurred while trying to create the global directory "${hp(
          EASYNEXT_DIR,
        )}" ${errorToString(err)}`,
      );

      throw err;
    }

    let config: GlobalConfig;
    try {
      config = configFiles.readConfigFile();
    } catch (err: unknown) {
      if (isErrnoException(err) && err.code === 'ENOENT') {
        config = defaultGlobalConfig;
        try {
          configFiles.writeToConfigFile(config);
        } catch (err: unknown) {
          output.error(
            `An unexpected error occurred while trying to save the config to "${hp(
              EASYNEXT_CONFIG_PATH,
            )}" ${errorToString(err)}`,
          );

          throw err;
        }
      } else {
        output.error(
          `An unexpected error occurred while trying to read the config in "${hp(
            EASYNEXT_CONFIG_PATH,
          )}" ${errorToString(err)}`,
        );

        throw err;
      }
    }

    // 설정 로드 후 언어 설정 초기화
    updateLanguage(config);

    let authConfig: AuthConfig;
    try {
      authConfig = configFiles.readAuthConfigFile();
    } catch (err: unknown) {
      if (isErrnoException(err) && err.code === 'ENOENT') {
        authConfig = defaultAuthConfig;
        try {
          configFiles.writeToAuthConfigFile(authConfig);
        } catch (err: unknown) {
          output.error(
            `An unexpected error occurred while trying to write the auth config to "${hp(
              EASYNEXT_AUTH_CONFIG_PATH,
            )}" ${errorToString(err)}`,
          );

          throw err;
        }
      } else {
        output.error(
          `An unexpected error occurred while trying to read the auth config in "${hp(
            EASYNEXT_AUTH_CONFIG_PATH,
          )}" ${errorToString(err)}`,
        );

        throw err;
      }
    }

    const GlobalConfigProvider: Provider = {
      provide: GlobalConfig,
      useFactory: () => {
        return new GlobalConfig(config);
      },
    };
    const AuthConfigProvider: Provider = {
      provide: AuthConfig,
      useFactory: () => {
        return new AuthConfig(authConfig);
      },
    };

    const providers = [GlobalConfigProvider, AuthConfigProvider];

    return {
      global: true,
      module: ConfigModule,
      providers: providers,
      exports: providers,
    };
  }
}

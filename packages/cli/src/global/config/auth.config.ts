export class AuthConfig {
  '// Note': string;
  '// Docs': string;

  skipWrite?: boolean;

  constructor(parial: AuthConfig) {
    Object.assign(this, parial);
  }
}

export const AUTH_CONFIG = 'AUTH_CONFIG';

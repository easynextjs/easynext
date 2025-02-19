export class AuthConfig {
  '// Note': string;
  '// Docs': string;

  skipWrite?: boolean;
  token?: string;

  constructor(parial: AuthConfig) {
    Object.assign(this, parial);
  }
}

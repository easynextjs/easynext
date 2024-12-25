export const LANG_CODES = ['en', 'ko'];
export type LangCode = (typeof LANG_CODES)[number];

export class GlobalConfig {
  '// Note': string;
  '// Docs': string;

  /** @default 'en' */
  lang?: LangCode;

  constructor(parial: GlobalConfig) {
    Object.assign(this, parial);

    this.lang ??= 'en';
  }
}

export function isValidLang(lang: string): lang is LangCode {
  return LANG_CODES.includes(lang);
}

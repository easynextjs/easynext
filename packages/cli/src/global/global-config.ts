import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalConfig {
  '// Note': string;
  '// Docs': string;

  lang?: 'ko' | 'en' = 'ko';
}

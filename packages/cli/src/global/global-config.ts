import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalConfig {
  lang: 'ko' | 'en' = 'ko';
}

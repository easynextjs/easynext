import { Module } from '@nestjs/common';
import { I18nCommand } from './i18n.command';

@Module({
  providers: [I18nCommand],
})
export class I18nModule {}

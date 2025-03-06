import { Module } from '@nestjs/common';
import { AdsenseCommand } from './adsense.command';

@Module({
  providers: [AdsenseCommand],
})
export class AdsenseModule {}

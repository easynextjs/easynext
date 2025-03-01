import { Module } from '@nestjs/common';
import { GtagCommand } from './gtag.command';

@Module({
  providers: [GtagCommand],
})
export class GtagModule {}

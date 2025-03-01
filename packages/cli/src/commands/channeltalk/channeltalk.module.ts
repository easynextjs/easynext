import { Module } from '@nestjs/common';
import { ChanneltalkCommand } from './channeltalk.command';

@Module({
  providers: [ChanneltalkCommand],
})
export class ChanneltalkModule {}

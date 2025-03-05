import { Module } from '@nestjs/common';
import { ChannelIOCommand } from './channelio.command';

@Module({
  providers: [ChannelIOCommand],
})
export class ChannelIOodule {}

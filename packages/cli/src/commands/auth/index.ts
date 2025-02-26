import { Module } from '@nestjs/common';
import { AuthCommand } from './auth.command';
import { ConfigModule } from '@/global/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [AuthCommand],
  exports: [AuthCommand],
})
export class AuthModule {}

export * from './auth.command';
export * from './actions/kakao';

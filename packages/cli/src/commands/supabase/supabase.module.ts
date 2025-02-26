import { Module } from '@nestjs/common';
import { SupabaseCommand } from './supabase.command';
import { ConfigModule } from '@/global/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [SupabaseCommand],
  exports: [SupabaseCommand],
})
export class SupabaseModule {}

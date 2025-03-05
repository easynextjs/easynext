import { CreateModule } from './create/create.module';
import { DoctorModule } from './doctor/doctor.module';
import { LangModule } from './lang/lang.module';
import { LoginCommand } from './login/login.command';
import { VersionModule } from './version/version.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthCommand } from './auth/auth.command';
import { GtagModule } from './gtag/gtag.module';
import { ClarityModule } from './clarity/clarity.module';
import { ChannelIOodule } from './channelio/channelio.module';
import { SentryModule } from './sentry/sentry.module';
import { I18nModule } from './i18n/i18n.module';

export const commandModules = [
  CreateModule,
  DoctorModule,
  LangModule,
  LoginCommand,
  VersionModule,
  SupabaseModule,
  AuthCommand,
  GtagModule,
  ClarityModule,
  ChannelIOodule,
  SentryModule,
  I18nModule,
];

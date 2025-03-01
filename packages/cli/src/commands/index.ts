import { CreateModule } from './create/create.module';
import { DoctorModule } from './doctor/doctor.module';
import { LangModule } from './lang/lang.module';
import { LoginCommand } from './login/login.command';
import { VersionModule } from './version/version.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthCommand } from './auth/auth.command';
import { GtagModule } from './gtag/gtag.module';
import { ClarityModule } from './clarity/clarity.module';

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
];

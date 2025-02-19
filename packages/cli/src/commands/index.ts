import { CreateModule } from './create/create.module';
import { DoctorModule } from './doctor/doctor.module';
import { LangModule } from './lang/lang.module';
import { LoginCommand } from './login/login.command';

export const commandModules = [
  CreateModule,
  DoctorModule,
  LangModule,
  LoginCommand,
];

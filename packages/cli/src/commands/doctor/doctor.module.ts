import { Module } from '@nestjs/common';

import { DoctorCommand } from './doctor.command';

@Module({
  providers: [DoctorCommand],
})
export class DoctorModule {}

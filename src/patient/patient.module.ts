import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
  imports: [MailModule],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}

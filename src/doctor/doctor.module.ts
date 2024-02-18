import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';

@Module({
  imports: [MailModule],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}

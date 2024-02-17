import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  NOTI_APPOINTMENT_CANCELED_BY_DOCTOR_PROCESS_NAME,
  NOTI_APPOINTMENT_CANCELED_BY_PATIENT_PROCESS_NAME,
  NOTI_APPOINTMENT_CONFIRMED_PROCESS_NAME,
  NOTI_APPOINTMENT_CREATED_PROCESS_NAME,
  RESET_PASSWORD_PROCESS_NAME,
  SEND_MAIL_QUEUE,
} from 'src/common/constants';
import {
  NotiAppointmentCanceledByDoctorDto,
  NotiAppointmentCanceledByPatientDto,
  NotiAppointmentConfirmedDto,
  NotiAppointmentCreatedDto,
  ResetPasswordDto,
} from '../dtos';
import { MailService } from '../services';

@Processor(SEND_MAIL_QUEUE)
export class EmailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process(NOTI_APPOINTMENT_CREATED_PROCESS_NAME)
  async notiAppointmentCreatedEmail(job: Job<NotiAppointmentCreatedDto>) {
    await this.mailService.sendNotiAppointmentCreatedMail(job.data);
  }

  @Process(NOTI_APPOINTMENT_CONFIRMED_PROCESS_NAME)
  async notiAppointmentConfirmed(job: Job<NotiAppointmentConfirmedDto>) {
    await this.mailService.sendNotiAppointmentConfirmedMail(job.data);
  }

  @Process(NOTI_APPOINTMENT_CANCELED_BY_PATIENT_PROCESS_NAME)
  async notiAppointmentCanceledByPatientEmail(
    job: Job<NotiAppointmentCanceledByPatientDto>,
  ) {
    await this.mailService.sendNotiAppointmentCanceledByPatientMail(job.data);
  }

  @Process(NOTI_APPOINTMENT_CANCELED_BY_DOCTOR_PROCESS_NAME)
  async notiAppointmentCanceledByDoctorEmail(
    job: Job<NotiAppointmentCanceledByDoctorDto>,
  ) {
    await this.mailService.sendNotiAppointmentCanceledByDoctorMail(job.data);
  }

  @Process(RESET_PASSWORD_PROCESS_NAME)
  async resetPasswordEmail(job: Job<ResetPasswordDto>) {
    await this.mailService.sendResetPasswordMail(job.data);
  }
}

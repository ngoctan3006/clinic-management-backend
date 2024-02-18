import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
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

@Injectable()
export class MailQueueService {
  constructor(@InjectQueue(SEND_MAIL_QUEUE) private readonly sendMail: Queue) {}

  async addNotiAppointmentCreatedMail(data: NotiAppointmentCreatedDto) {
    await this.sendMail.add(NOTI_APPOINTMENT_CREATED_PROCESS_NAME, data, {
      removeOnComplete: true,
    });
  }

  async addNotiAppointmentConfirmedMail(data: NotiAppointmentConfirmedDto) {
    await this.sendMail.add(NOTI_APPOINTMENT_CONFIRMED_PROCESS_NAME, data, {
      removeOnComplete: true,
    });
  }

  async addNotiAppointmentCanceledByPatientMail(
    data: NotiAppointmentCanceledByPatientDto,
  ) {
    await this.sendMail.add(
      NOTI_APPOINTMENT_CANCELED_BY_PATIENT_PROCESS_NAME,
      data,
      {
        removeOnComplete: true,
      },
    );
  }

  async addNotiAppointmentCanceledByDoctorMail(
    data: NotiAppointmentCanceledByDoctorDto,
  ) {
    await this.sendMail.add(
      NOTI_APPOINTMENT_CANCELED_BY_DOCTOR_PROCESS_NAME,
      data,
      {
        removeOnComplete: true,
      },
    );
  }

  async addResetPasswordMail(data: ResetPasswordDto) {
    await this.sendMail.add(RESET_PASSWORD_PROCESS_NAME, data, {
      removeOnComplete: true,
    });
  }
}

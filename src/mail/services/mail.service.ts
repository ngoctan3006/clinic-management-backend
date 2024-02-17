import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import {
  NotiAppointmentCanceledByDoctorDto,
  NotiAppointmentCanceledByPatientDto,
  NotiAppointmentConfirmedDto,
  NotiAppointmentCreatedDto,
  ResetPasswordDto,
} from '../dtos';

@Injectable()
export class MailService {
  private readonly logger: Logger;

  constructor(private readonly mailerService: MailerService) {
    this.logger = new Logger(MailService.name);
  }

  async sendNotiAppointmentCreatedMail(data: NotiAppointmentCreatedDto) {
    const { to, ...context } = data;
    await this.mailerService.sendMail({
      to,
      subject: 'Thông báo lịch hẹn mới',
      template: './noti-appointment-created',
      context,
    });
    this.logger.log(`Mail sent to ${to} successfully`);
  }

  async sendNotiAppointmentConfirmedMail(data: NotiAppointmentConfirmedDto) {
    const { to, ...context } = data;
    await this.mailerService.sendMail({
      to,
      subject: 'Thông báo xác nhận lịch hẹn',
      template: './noti-appointment-confirmed',
      context,
    });
    this.logger.log(`Mail sent to ${to} successfully`);
  }

  async sendNotiAppointmentCanceledByPatientMail(
    data: NotiAppointmentCanceledByPatientDto,
  ) {
    const { to, ...context } = data;
    await this.mailerService.sendMail({
      to,
      subject: 'Thông báo hủy lịch hẹn',
      template: './noti-appointment-canceled-by-patient',
      context,
    });
    this.logger.log(`Mail sent to ${to} successfully`);
  }

  async sendNotiAppointmentCanceledByDoctorMail(
    data: NotiAppointmentCanceledByDoctorDto,
  ) {
    const { to, ...context } = data;
    await this.mailerService.sendMail({
      to,
      subject: 'Thông báo hủy lịch hẹn',
      template: './noti-appointment-canceled-by-doctor',
      context,
    });
    this.logger.log(`Mail sent to ${to} successfully`);
  }

  async sendResetPasswordMail(data: ResetPasswordDto) {
    const { email } = data;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Đặt lại mật khẩu',
      template: './reset-password',
      context: data,
    });
    this.logger.log(`Mail sent to ${email} successfully`);
  }
}

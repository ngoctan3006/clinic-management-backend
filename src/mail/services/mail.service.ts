import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ResetPasswordDto } from '../dtos';

@Injectable()
export class MailService {
  private readonly logger: Logger;

  constructor(private readonly mailerService: MailerService) {
    this.logger = new Logger(MailService.name);
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

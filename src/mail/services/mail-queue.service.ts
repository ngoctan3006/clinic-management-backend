import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import {
  RESET_PASSWORD_PROCESS_NAME,
  SEND_MAIL_QUEUE,
} from 'src/common/constants';
import { ResetPasswordDto } from '../dtos';

@Injectable()
export class MailQueueService {
  constructor(@InjectQueue(SEND_MAIL_QUEUE) private readonly sendMail: Queue) {}

  async addResetPasswordMail(data: ResetPasswordDto) {
    await this.sendMail.add(RESET_PASSWORD_PROCESS_NAME, data, {
      removeOnComplete: true,
    });
  }
}

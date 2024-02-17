import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ResetPasswordDto } from '../dtos';

@Injectable()
export class MailQueueService {
  constructor(@InjectQueue('send-mail') private readonly sendMail: Queue) {}

  async addResetPasswordMail(data: ResetPasswordDto) {
    await this.sendMail.add('reset-password', data, {
      removeOnComplete: true,
    });
  }
}

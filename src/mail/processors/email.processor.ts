import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  RESET_PASSWORD_PROCESS_NAME,
  SEND_MAIL_QUEUE,
} from 'src/common/constants';
import { ResetPasswordDto } from '../dtos';
import { MailService } from '../services';

@Processor(SEND_MAIL_QUEUE)
export class EmailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process(RESET_PASSWORD_PROCESS_NAME)
  async resetPasswordEmail(job: Job<ResetPasswordDto>) {
    await this.mailService.sendResetPasswordMail(job.data);
  }
}

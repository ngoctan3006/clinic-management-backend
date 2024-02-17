import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ResetPasswordDto } from '../dtos';
import { MailService } from '../services';

@Processor('send-mail')
export class EmailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('reset-password')
  async resetPasswordEmail(job: Job<ResetPasswordDto>) {
    await this.mailService.sendResetPasswordMail(job.data);
  }
}

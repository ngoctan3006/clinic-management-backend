import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_KEY, SEND_MAIL_QUEUE } from 'src/common/constants';
import { MailQueueService, MailService } from './services';

@Module({
  imports: [
    BullModule.registerQueue({
      name: SEND_MAIL_QUEUE,
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>(ENV_KEY.MAIL_HOST),
          secure: false,
          auth: {
            user: configService.get<string>(ENV_KEY.MAIL_USER),
            pass: configService.get<string>(ENV_KEY.MAIL_PASSWORD),
          },
        },
        defaults: {
          from: `"${configService.get<string>(
            ENV_KEY.MAIL_FROM_NAME,
          )}" <${configService.get<string>(ENV_KEY.MAIL_FROM_ADDRESS)}>`,
        },
        template: {
          dir: __dirname + '/../mail/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService, MailQueueService],
  exports: [MailService, MailQueueService],
})
export class MailModule {}

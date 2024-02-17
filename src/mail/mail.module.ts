import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_KEY } from 'src/common/constants';
import { MailQueueService, MailService } from './services';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-mail',
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
          dir: __dirname + '/../modules/mail/templates',
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

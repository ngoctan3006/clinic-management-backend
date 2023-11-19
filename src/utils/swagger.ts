import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENV_KEY } from 'src/constants';

export const setupSwagger = (
  app: INestApplication,
  configService: ConfigService
) => {
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>(ENV_KEY.APP_NAME))
    .setDescription('Clinic management server api documentation')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      basePath: '/v1',
    },
  });
};

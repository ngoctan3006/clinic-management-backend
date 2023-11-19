import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV_KEY } from './constants';
import { setupSwagger } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const prefix = configService.get<string>(ENV_KEY.PREFIX);
  const port = configService.get<number>(ENV_KEY.PORT);

  app.setGlobalPrefix(prefix);
  app.enableCors({ origin: '*' });

  setupSwagger(app, configService);

  await app.listen(port || 3000);
}
bootstrap();

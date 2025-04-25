import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

void (async function () {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  const port = Number(config.get('PORT') ?? 3031);

  app.setBaseViewsDir(resolve(__dirname, '..', 'client'));
  app.setViewEngine('hbs');

  await app.listen(port);
  console.log(`o..o - listening on ${port}`);
})();

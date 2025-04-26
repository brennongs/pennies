import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

void (async function () {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  const port = Number(config.get('PORT') ?? 3031);

  app.useStaticAssets(resolve(__dirname, '..', 'client'));
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(port);
  console.log(`o..o - listening @ ${await app.getUrl()}`);
})();

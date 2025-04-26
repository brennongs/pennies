import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './initializers/prisma';
import { GameController } from './clients/game.controller';
import { ClientGateway } from './clients/client.gateway';
import { SessionsRepository } from './accessors/session';
import { UsersRepository } from './accessors/user';

@Module({
  imports: [ConfigModule, EventEmitterModule.forRoot(), PrismaModule],
  controllers: [GameController],
  providers: [
    ClientGateway,
    SessionsRepository,
    UsersRepository,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}

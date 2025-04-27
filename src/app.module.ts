import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './initializers/events/events.module';
import { PrismaModule } from './initializers/prisma';
import { GameController } from './clients/game.controller';
import { ClientGateway } from './clients/client.gateway';
import { SessionsRepository } from './accessors/session';
import { UsersRepository } from './accessors/user';
import { TransactionsRepository } from './accessors/transaction';
import { TransactionEngine } from './engines/transaction';

@Module({
  imports: [ConfigModule, EventsModule, PrismaModule],
  controllers: [GameController],
  providers: [
    ClientGateway,
    SessionsRepository,
    UsersRepository,
    TransactionsRepository,
    TransactionEngine,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}

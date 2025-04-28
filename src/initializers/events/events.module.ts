import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TransactionCreatedEvent } from './transaction-created.event';
import { TransactionTransformedEvent } from './transaction-transformed.event';
import { UserCreatedEvent } from './user-created.event';
import { SessionCreatedEvent } from './session-created.event';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    TransactionCreatedEvent,
    TransactionTransformedEvent,
    UserCreatedEvent,
    SessionCreatedEvent,
  ],
  exports: [
    TransactionCreatedEvent,
    TransactionTransformedEvent,
    UserCreatedEvent,
    SessionCreatedEvent,
  ],
})
export class EventsModule {}

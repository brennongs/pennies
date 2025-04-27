import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TransactionCreatedEvent } from './transaction-created.event';
import { TransactionTransformedEvent } from './transaction-transformed.event';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [TransactionCreatedEvent, TransactionTransformedEvent],
  exports: [TransactionCreatedEvent, TransactionTransformedEvent],
})
export class EventsModule {}

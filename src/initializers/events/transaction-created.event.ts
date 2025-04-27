import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Transaction } from 'src/initializers/prisma';

const topic = 'transaction.created';

@Injectable()
export class TransactionCreatedEvent {
  public static topic = topic;
  constructor(private readonly events: EventEmitter2) {}

  emit(payload: Transaction) {
    this.events.emit(topic, payload);
  }
}

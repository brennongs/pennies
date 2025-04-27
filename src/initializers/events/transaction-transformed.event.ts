import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface Payload {
  message: string;
  sessionId: string;
}

const topic = 'transaction.transformed';

@Injectable()
export class TransactionTransformedEvent {
  public static topic = topic;
  constructor(private readonly events: EventEmitter2) {}

  emit(payload: Payload) {
    this.events.emit(topic, payload);
  }
}

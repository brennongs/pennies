import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Session } from 'src/initializers/prisma';

const topic = 'session.created';

@Injectable()
export class SessionCreatedEvent {
  public static topic = topic;

  constructor(private readonly events: EventEmitter2) {}

  emit(payload: Session) {
    this.events.emit(topic, payload);
  }
}

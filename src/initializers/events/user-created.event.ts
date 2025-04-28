import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from 'src/initializers/prisma';

const topic = 'user.created';

@Injectable()
export class UserCreatedEvent {
  public static topic = topic;

  constructor(private readonly events: EventEmitter2) {}

  emit(payload: User) {
    this.events.emit(topic, payload);
  }
}

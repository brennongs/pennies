import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  TransactionCreatedEvent,
  TransactionTransformedEvent,
} from 'src/initializers/events';
import { Transaction, TransactionType } from 'src/initializers/prisma';
import { UsersRepository } from 'src/accessors/user';

@Injectable()
export class TransactionEngine {
  constructor(
    private readonly users: UsersRepository,
    private readonly transactionTransformed: TransactionTransformedEvent,
  ) {}

  @OnEvent(TransactionCreatedEvent.topic)
  async prepareForNotification(payload: Transaction) {
    const originator = await this.users.findOneBy({ id: payload.originatorId });
    const recipient = await this.users.findOneBy({ id: payload.recipientId });
    const machine = {
      [TransactionType.PAYMENT]: `${originator.username} paid ${recipient.username} $${payload.amount}.`,
      [TransactionType.REQUEST]: `${originator.username} requested $${payload.amount} from ${recipient.username}`,
    };

    this.transactionTransformed.emit({
      message: machine[payload.transactionType],
      sessionId: payload.sessionId,
    });
  }
}

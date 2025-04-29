import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  TransactionCreatedEvent,
  TransactionTransformedEvent,
} from 'src/initializers/events';
import { Transaction, TransactionType } from 'src/initializers/prisma';
import { TransactionsRepository } from 'src/accessors/transaction';
import { UsersRepository } from 'src/accessors/user';

export interface TransformedTransaction {
  message: string;
  sessionId: string;
}

@Injectable()
export class TransactionEngine {
  constructor(
    private readonly users: UsersRepository,
    private readonly transactions: TransactionsRepository,
    private readonly transactionTransformed: TransactionTransformedEvent,
  ) {}

  async getAllBy(filter: { sessionId: string }) {
    const transactions = await this.transactions.findAllBy({
      sessionId: filter.sessionId,
    });

    return await Promise.all(
      transactions.map((transaction) =>
        this.prepareForNotification(transaction),
      ),
    );
  }

  @OnEvent(TransactionCreatedEvent.topic)
  async handleTransactionCreated(payload: Transaction) {
    this.transactionTransformed.emit(
      await this.prepareForNotification(payload),
    );
  }

  private async prepareForNotification(payload: Transaction) {
    const originator = await this.users.findOneBy({ id: payload.originatorId });
    const recipient = await this.users.findOneBy({ id: payload.recipientId });
    const machine = {
      [TransactionType.PAYMENT]: `${originator.username} paid ${recipient.username} $${payload.amount}.`,
      [TransactionType.REQUEST]: `${originator.username} requested $${payload.amount} from ${recipient.username}`,
    };
    const transformed = {
      message: machine[payload.transactionType],
      sessionId: payload.sessionId,
    };

    return transformed;
  }
}

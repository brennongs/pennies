import { Injectable } from '@nestjs/common';
import { Repository } from 'src/initializers/fishery';
import {
  Prisma,
  PrismaService,
  Transaction,
  TransactionType,
} from 'src/initializers/prisma';
import { TransactionCreatedEvent } from 'src/initializers/events';

interface Transient {
  broadcast?: boolean;
}

@Injectable()
export class TransactionsRepository extends Repository<
  Omit<Transaction, 'id'>,
  Transaction,
  Transient
> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionCreated: TransactionCreatedEvent,
  ) {
    super((generator) => ({ onCreate, params, transientParams }) => {
      onCreate(async (params) => {
        const transaction = await this.prisma.transaction.create({
          data: params,
        });

        if (transientParams.broadcast ?? true) {
          this.transactionCreated.emit(transaction);
        }

        return transaction;
      });

      if (
        !params.originatorId ||
        !params.recipientId ||
        !params.amount ||
        !params.sessionId
      ) {
        throw new Error('please provide all necessary transaction parameters');
      }

      return {
        originatorId: generator.string.uuid(),
        recipientId: generator.string.uuid(),
        sessionId: generator.string.uuid(),
        transactionType: TransactionType.PAYMENT,
        amount: 0,
      };
    });
  }

  find(filter: Prisma.TransactionWhereInput) {
    return this.prisma.transaction.findMany({
      where: filter,
    });
  }
}

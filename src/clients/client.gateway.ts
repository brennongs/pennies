import { WebSocket } from 'ws';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { TransactionType, Session } from 'src/initializers/prisma';
import { UsersRepository } from 'src/accessors/user';
import { TransactionsRepository } from 'src/accessors/transaction';
import {
  TransactionTransformedEvent,
  SessionCreatedEvent,
} from 'src/initializers/events';

enum IncomingWebsocketEvents {
  UserJoin = 'user.join',
  TransactionPay = 'transaction.pay',
  TransactionRequest = 'transaction.request',
}

enum OutgoingWebsocketEvents {
  TransactionPosted = 'transaction.posted',
  RequestMade = 'request.made',
  UserAdded = 'user.added',
  BalanceChanged = 'balance.changed',
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ClientGateway extends Map<string, Map<string, WebSocket>> {
  constructor(
    private readonly users: UsersRepository,
    private readonly transactions: TransactionsRepository,
  ) {
    super();
  }

  @OnEvent(SessionCreatedEvent.topic)
  createNewGameSession(payload: Session) {
    if (!this.has(payload.id)) {
      this.set(payload.id, new Map());
    }
  }

  @OnEvent(TransactionTransformedEvent.topic)
  postTransaction(payload: { message: string; sessionId: string }) {
    const room = this.get(payload.sessionId);
    room?.forEach((client) => {
      client.send(
        JSON.stringify({
          event: OutgoingWebsocketEvents.TransactionPosted,
          payload: payload.message,
        }),
      );
    });
  }

  @SubscribeMessage(IncomingWebsocketEvents.UserJoin)
  async addUserToRoom(
    @ConnectedSocket() socket: WebSocket,
    @MessageBody('sessionId') sessionId: string,
    @MessageBody('userId') userId: string,
  ) {
    const room = this.get(sessionId);
    const users = await this.users.findAllBy({ sessionId });

    if (!room) {
      return;
    }

    room.set(userId, socket);
    room.forEach((client) => {
      client.send(
        JSON.stringify({
          event: OutgoingWebsocketEvents.UserAdded,
          payload: {
            users: users.filter((user) => user.username !== 'the bank'),
            me: users.find((user) => user.id === userId),
          },
        }),
      );
    });
  }

  @SubscribeMessage(IncomingWebsocketEvents.TransactionPay)
  async makePayment(
    @MessageBody('originatorId') originatorId: string,
    @MessageBody('recipientId') recipientId: string,
    @MessageBody('amount') amount: string,
  ) {
    const [recipient, originator] = await Promise.all([
      this.users.updateBy({ id: recipientId }, (user) => ({
        ...user,
        balance: Number(user.balance) + Number(amount),
      })),
      this.users.updateBy({ id: originatorId }, (user) => ({
        ...user,
        balance: Number(user.balance) - Number(amount),
      })),
    ]);

    await this.transactions.create({
      originatorId: originator.id,
      recipientId: recipient.id,
      amount: +amount,
      sessionId: recipient.sessionId,
      transactionType: TransactionType.PAYMENT,
    });

    const room = this.get(recipient.sessionId);
    const recipientClient = room?.get(recipientId);
    const senderClient = room?.get(originatorId);

    recipientClient?.send(
      JSON.stringify({
        event: OutgoingWebsocketEvents.BalanceChanged,
        payload: {
          balance: recipient.balance,
        },
      }),
    );
    senderClient?.send(
      JSON.stringify({
        event: OutgoingWebsocketEvents.BalanceChanged,
        payload: {
          balance: originator.balance,
        },
      }),
    );
  }

  @SubscribeMessage(IncomingWebsocketEvents.TransactionRequest)
  async makeRequest(
    @MessageBody('originatorId') originatorId: string,
    @MessageBody('recipientId') recipientId: string,
    @MessageBody('amount') amount: string,
  ) {
    const originator = await this.users.findOneBy({ id: originatorId });
    const recipient = await this.users.findOneBy({ id: recipientId });
    const room = this.get(originator.sessionId);

    if (recipient.username === 'the bank') {
      const originatorClient = room?.get(originatorId);
      const { balance } = await this.users.updateBy(
        { id: originatorId },
        (user) => ({
          ...user,
          balance: Number(user.balance) + Number(amount),
        }),
      );

      await this.transactions.create({
        originatorId: recipientId,
        recipientId: originatorId,
        amount: +amount,
        sessionId: originator.sessionId,
        transactionType: TransactionType.PAYMENT,
      });

      originatorClient?.send(
        JSON.stringify({
          event: OutgoingWebsocketEvents.BalanceChanged,
          payload: {
            balance,
          },
        }),
      );
      return;
    }

    const recipientClient = room?.get(recipientId);
    await this.transactions.create({
      originatorId: originatorId,
      recipientId: recipientId,
      amount: +amount,
      sessionId: originator.sessionId,
      transactionType: TransactionType.REQUEST,
    });

    recipientClient?.send(
      JSON.stringify({
        event: OutgoingWebsocketEvents.RequestMade,
        payload: {
          message: `${originator.username} has requested $${amount} from you!`,
          originatorId: originatorId,
          amount,
        },
      }),
    );
  }
}

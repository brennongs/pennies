import { WebSocket } from 'ws';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { TransactionType } from 'src/initializers/prisma';
import { UsersRepository } from 'src/accessors/user';
import { TransactionsRepository } from 'src/accessors/transaction';
import { TransactionTransformedEvent } from 'src/initializers/events';

export enum GameEvents {
  Register = 'game.register',
}

@WebSocketGateway()
export class ClientGateway extends Map<string, Map<string, WebSocket>> {
  constructor(
    private readonly users: UsersRepository,
    private readonly transactions: TransactionsRepository,
  ) {
    super();
  }

  @OnEvent('game.created')
  createNewGameSession(payload: { sessionId: string }) {
    if (!this.has(payload.sessionId)) {
      this.set(payload.sessionId, new Map());
    }
  }

  @OnEvent(TransactionTransformedEvent.topic)
  postTransaction(payload: { message: string; sessionId: string }) {
    const room = this.get(payload.sessionId);
    room?.forEach((client) => {
      client.send(
        JSON.stringify({
          event: 'transaction.posted',
          payload: payload.message,
        }),
      );
    });
  }

  @SubscribeMessage('user.join')
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
          event: 'user.added',
          payload: {
            users: users.filter((user) => user.username !== 'the bank'),
            me: users.find((user) => user.id === userId),
          },
        }),
      );
    });
  }

  // @SubscribeMessage('session.start')
  // startSession(@MessageBody('sessionId') sessionId: string) {
  //   const room = this.get(sessionId);

  //   room?.forEach((client) => {
  //     client.send(
  //       JSON.stringify({
  //         event: 'session.start',
  //       }),
  //     );
  //   });
  // }

  @SubscribeMessage('transaction.pay')
  async payUser(
    @MessageBody('sessionId') sessionId: string,
    @MessageBody('senderId') senderId: string,
    @MessageBody('recipientId') recipientId: string,
    @MessageBody('amount') amount: number,
  ) {
    const [recipient, originator] = await Promise.all([
      this.users.updateBy({ id: recipientId }, (user) => {
        console.log(user, amount);
        return {
          ...user,
          balance: Number(user.balance) + Number(amount),
        };
      }),
      this.users.updateBy({ id: senderId }, (user) => ({
        ...user,
        balance: Number(user.balance) - Number(amount),
      })),
    ]);

    await this.transactions.create({
      originatorId: originator.id,
      recipientId: recipient.id,
      amount: +amount,
      sessionId,
      transactionType: TransactionType.PAYMENT,
    });

    const room = this.get(sessionId);
    const recipientClient = room?.get(recipientId);
    const senderClient = room?.get(senderId);

    recipientClient?.send(
      JSON.stringify({
        event: 'balance.changed',
        payload: {
          balance: recipient.balance,
        },
      }),
    );
    senderClient?.send(
      JSON.stringify({
        event: 'balance.changed',
        payload: {
          balance: originator.balance,
        },
      }),
    );
  }

  // @SubscribeMessage('game.request')
}

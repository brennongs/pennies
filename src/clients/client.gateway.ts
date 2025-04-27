import { WebSocket } from 'ws';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { UsersRepository } from 'src/accessors/user';

export enum GameEvents {
  Register = 'game.register',
}

@WebSocketGateway()
export class ClientGateway extends Map<string, Set<WebSocket>> {
  constructor(private readonly users: UsersRepository) {
    super();
  }

  @OnEvent('game.created')
  createNewGameSession(payload: { sessionId: string }) {
    if (!this.has(payload.sessionId)) {
      this.set(payload.sessionId, new Set());
    }
  }

  @SubscribeMessage('user.join')
  async addUserToRoom(
    @ConnectedSocket() socket: WebSocket,
    @MessageBody('sessionId') sessionId: string,
  ) {
    console.log('user joined!');
    const room = this.get(sessionId);
    const users = await this.users.findBy({ sessionId });

    if (!room) {
      console.log('no room :(');
      return;
    }

    room.add(socket);
    room.forEach((client) => {
      client.send(
        JSON.stringify({
          event: 'user.added',
          payload: {
            usernames: users
              .filter((user) => user.username !== 'bank')
              .map((user) => user.username),
          },
        }),
      );
    });
  }
}

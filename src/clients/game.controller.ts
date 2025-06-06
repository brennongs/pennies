import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SessionsRepository } from 'src/accessors/session';
import { UsersRepository, User } from 'src/accessors/user';
import {
  TransactionEngine,
  TransformedTransaction,
} from 'src/engines/transaction';

interface GameState {
  others: User[];
  me: User;
  trades: TransformedTransaction[];
  shortCode: string;
}

@Controller('games')
export class GameController {
  constructor(
    private readonly sessions: SessionsRepository,
    private readonly users: UsersRepository,
    private readonly transactions: TransactionEngine,
  ) {}

  @Post()
  async create(@Body() data: { nest: string; username: string }): Promise<{
    sessionId: string;
    shortCode: string;
    userId: string;
  }> {
    const gameSession = await this.sessions.create({
      nest: Number(data.nest),
    });

    await this.users.create(
      {
        username: 'the bank',
        sessionId: gameSession.id,
      },
      { transient: { broadcast: false } },
    );

    const user = await this.users.create({
      username: data.username,
      sessionId: gameSession.id,
    });

    return {
      sessionId: gameSession.id,
      userId: user.id,
      shortCode: gameSession.shortCode,
    };
  }

  @Post('/:shortCode/join')
  async join(
    @Param('shortCode') shortCode: string,
    @Body() body: { username: string },
  ) {
    const gameSession = await this.sessions.select({ shortCode });

    if (!gameSession) {
      throw new HttpException('game not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.users.create({
      username: body.username,
      sessionId: gameSession.id,
    });

    return {
      sessionId: gameSession.id,
      userId: user.id,
      username: body.username,
    };
  }

  @Get('/:shortCode/users')
  async rejoin(@Param('shortCode') shortCode: string) {
    const { id: sessionId } = await this.sessions.select({ shortCode });
    const users = await this.users.search({ sessionId });

    return {
      users: users
        .filter((user) => user.username !== 'the bank')
        .map(({ id, username }) => ({ id, username })),
      sessionId,
    };
  }

  @Get('/:sessionId/:userId')
  async getGameState(
    @Param('sessionId') sessionId: string,
    @Param('userId') userId: string,
  ): Promise<GameState> {
    const session = await this.sessions.select({ id: sessionId });
    const users = await this.users.search({ sessionId });
    const trades = await this.transactions.getAllBy({ sessionId });

    return {
      shortCode: session.shortCode,
      others: users.filter((user) => user.id !== userId),
      me: users.find((user) => user.id === userId)!,
      trades,
    };
  }
}

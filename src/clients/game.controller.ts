import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SessionsRepository, Session } from 'src/accessors/session';
import { UsersRepository } from 'src/accessors/user';

@Controller('games')
export class GameController {
  constructor(
    private readonly sessions: SessionsRepository,
    private readonly users: UsersRepository,
  ) {}

  @Get(':shortCode')
  getOne(@Param('shortCode') shortCode: string): Promise<Session> {
    return this.sessions.getBy({ shortCode });
  }

  @Post()
  async create(@Body() data: { nest: string; username: string }): Promise<{
    sessionId: string;
    shortCode: string;
  }> {
    const gameSession = await this.sessions.create({
      nest: Number(data.nest),
    });

    await this.users.create(
      {
        username: 'bank',
        sessionId: gameSession.id,
      },
      { transient: { broadcast: false } },
    );

    await this.users.create({
      username: data.username,
      sessionId: gameSession.id,
    });

    return {
      sessionId: gameSession.id,
      shortCode: gameSession.shortCode,
    };
  }

  @Post('/:shortCode/join')
  async join(
    @Param('shortCode') shortCode: string,
    @Body() body: { username: string },
  ) {
    const gameSession = await this.sessions.getBy({ shortCode });

    if (!gameSession) {
      throw new HttpException('game not found', HttpStatus.NOT_FOUND);
    }

    await this.users.create({
      username: body.username,
      sessionId: gameSession.id,
    });

    return {
      sessionId: gameSession.id,
      username: body.username,
    };
  }
}

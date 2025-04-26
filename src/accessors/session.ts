import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository } from 'src/initializers/fishery';
import { Session, Prisma, PrismaService } from 'src/initializers/prisma';

@Injectable()
export class SessionsRepository extends Repository<
  Prisma.SessionCreateInput,
  Session,
  void
> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {
    super((generate) => ({ onCreate }) => {
      onCreate(async (params) => {
        const result = await this.prisma.session.create({
          data: params,
        });

        this.events.emit('game.created', {
          sessionId: result.id,
          shortCode: result.shortCode,
        });

        return result;
      });

      return {
        shortCode: generate.string
          .alpha({
            length: 5,
          })
          .toUpperCase(),
        nest: 0,
      };
    });
  }

  public getBy(where: Prisma.SessionWhereInput): Promise<Session> {
    return this.prisma.session.findFirstOrThrow({ where });
  }

  public getAll(): Promise<Session[]> {
    return this.prisma.session.findMany();
  }
}

export { Session };

import { Injectable } from '@nestjs/common';
import { Repository } from 'src/initializers/fishery';
import { SessionCreatedEvent } from 'src/initializers/events';
import { Session, Prisma, PrismaService } from 'src/initializers/prisma';

@Injectable()
export class SessionsRepository extends Repository<
  Prisma.SessionCreateInput,
  Session,
  void
> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionCreated: SessionCreatedEvent,
  ) {
    super((generate) => ({ onCreate }) => {
      onCreate(async (params) => {
        const result = await this.prisma.session.create({
          data: params,
        });

        this.sessionCreated.emit(result);

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

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository } from 'src/initializers/fishery';
import { PrismaService, Prisma, User } from 'src/initializers/prisma';

interface Transient {
  broadcast?: boolean;
}

@Injectable()
export class UsersRepository extends Repository<
  Prisma.UserUncheckedCreateInput,
  User,
  Transient
> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {
    super((generator) => ({ onCreate, params, transientParams }) => {
      onCreate(async (params) => {
        const gameSession = await this.prisma.session.findFirst({
          where: {
            id: params.sessionId,
          },
        });
        const result = await this.prisma.user.create({
          data: {
            ...params,
            balance: gameSession?.nest,
          },
        });

        if (transientParams.broadcast ?? true) {
          this.events.emit('user.added', {
            data: {
              username: result.username,
              sessionId: result.sessionId,
            },
          });
        }

        return result;
      });

      if (!params.sessionId) {
        throw new Error('please provide a session id');
      }

      return {
        username: generator.person.firstName(),
        sessionId: params.sessionId,
      };
    });
  }

  public findBy(params?: Prisma.UserWhereInput): Promise<User[]> {
    return this.prisma.user.findMany({ where: params });
  }

  public async updateBy(
    filter: Prisma.UserWhereUniqueInput,
    update: (current: User) => User,
    // meta?: Transient,
  ) {
    const user = await this.prisma.user.findFirstOrThrow({ where: filter });
    const changes = update(user);

    return this.prisma.user.update({
      where: filter,
      data: changes,
    });
  }
}

export { User };

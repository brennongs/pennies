import { Injectable } from '@nestjs/common';
import { Repository } from 'src/initializers/fishery';
import { UserCreatedEvent } from 'src/initializers/events';
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
    private readonly userCreated: UserCreatedEvent,
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
          this.userCreated.emit(result);
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

  public findOneBy(params?: Prisma.UserWhereInput): Promise<User> {
    return this.prisma.user.findFirstOrThrow({ where: params });
  }

  public findAllBy(params?: Prisma.UserWhereInput): Promise<User[]> {
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

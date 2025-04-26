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
        const result = await this.prisma.user.create({
          data: params,
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
}

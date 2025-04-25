import { Injectable } from '@nestjs/common';
import { Repository } from 'src/initializers/fishery';
import { PrismaService, Prisma, User } from 'src/initializers/prisma';

@Injectable()
export class UsersRepository extends Repository<Prisma.UserCreateInput, User> {
  constructor(private readonly prisma: PrismaService) {
    super((generator) => ({ onCreate }) => {
      onCreate(async (params) => {
        return this.prisma.user.create({
          data: params,
        });
      });

      return {
        email: generator.internet.email(),
        name: generator.person.fullName(),
      };
    });
  }

  public findBy(params?: Prisma.UserWhereInput): Promise<User[]> {
    return this.prisma.user.findMany({ where: params });
  }
}

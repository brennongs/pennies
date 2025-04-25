import { Module } from '@nestjs/common';
import { PrismaService } from 'src/initializers/prisma';
import { UsersRepository } from 'src/repositories/user';

@Module({
  providers: [PrismaService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}

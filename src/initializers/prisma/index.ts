import { Module } from '@nestjs/common';
import { PrismaService } from './service';
export * from 'generated/prisma';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
export { PrismaService };

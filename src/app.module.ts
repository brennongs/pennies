import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers';
import { UsersModule } from './modules/users';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}

import { Controller, Get, Render } from '@nestjs/common';
import { User } from 'generated/prisma';
import { UsersRepository } from 'src/repositories/user';

@Controller()
export class AppController {
  constructor(private readonly users: UsersRepository) {}

  @Get('users')
  @Render('users')
  async index(): Promise<{ users: User[] }> {
    let users = await this.users.findBy();

    if (!users.length) {
      users = await this.users.createList(10);
    }

    return { users };
  }
}

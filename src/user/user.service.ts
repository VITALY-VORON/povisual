import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<User, 'id'>) {
    return await this.prisma.user.create({ data });
  }

  async getById(id: User['id']) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { nodes: true },
    });
  }

  async getByEmail(email: User['email']) {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}

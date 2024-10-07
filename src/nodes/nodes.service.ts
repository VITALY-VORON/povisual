import { Injectable } from '@nestjs/common';
import { Node, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NodesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<Node, 'id'>) {
    const node = await this.prisma.node.create({ data });

    await this.prisma.user.update({
      where: { id: data.userId },
      data: { nodes: { connect: { id: node.id } } },
    });

    return node;
  }

  async getNodeById(id: Node['id']) {
    return await this.prisma.node.findUnique({
      where: { id },
    });
  }

  async getAllNodes(userId: User['id']) {
    return await this.prisma.node.findMany({
      where: {
        userId,
      },
    });
  }

  async edit(data: Node) {
    return await this.prisma.node.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: Node['id']) {
    return await this.prisma.node.delete({
      where: {
        id: id,
      },
    });
  }
}

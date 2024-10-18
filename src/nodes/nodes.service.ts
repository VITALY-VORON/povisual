import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Node, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class NodesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Omit<Node, "id" | "userId">, id: User["id"]) {
        const newNode = {
            userId: id,
            ...data,
        };
        const node = await this.prisma.node.create({ data: newNode });

        await this.prisma.user.update({
            where: { id },
            data: { nodes: { connect: { id: node.id } } },
        });

        return node;
    }

    async getNodeById(id: Node["id"], userId: User["id"]) {
        const res = await this.prisma.node.findUnique({
            where: { id },
        });

        if (res.userId !== userId) {
            throw new NotFoundException("Метка не найдена");
        }

        return res;
    }

    async getAllNodes(id: User["id"]) {
        return await this.prisma.node.findMany({
            where: {
                userId: id,
            },
        });
    }

    async edit(data: Omit<Node, "userId">, userId: User["id"]) {
        const node = await this.getNodeById(data.id, userId);

        if (!node) {
            throw new NotFoundException("Метка не найдена");
        }

        return await this.prisma.node.update({
            where: { id: data.id },
            data,
        });
    }

    async delete(id: Node["id"], userId: User["id"]) {
        const node = await this.getNodeById(id, userId);

        if (!node) {
            throw new NotFoundException("Метка не найдена");
        }

        return await this.prisma.node.delete({
            where: {
                id: id,
            },
        });
    }
}

import { Injectable } from "@nestjs/common";
import { Node, Location } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class NodesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Omit<Node, "id" | "locationid">, id: Location["id"]) {
        const node = await this.prisma.node.create({ data });

        await this.prisma.location.update({
            where: { id: id },
            data: { nodes: { connect: { id: node.id } } },
        });
    }

    async getNodeById(id: Node["id"]) {
        const res = await this.prisma.node.findUnique({
            where: { id },
        });

        return res;
    }

    async getAllNodes() {
        return await this.prisma.node.findMany();
    }

    // async edit(data: Omit<Node, "userId">, userId: User["id"]) {
    //     const node = await this.getNodeById(data.id, userId);

    //     if (!node) {
    //         throw new NotFoundException("Метка не найдена");
    //     }

    //     return await this.prisma.node.update({
    //         where: { id: data.id },
    //         data,
    //     });
    // }

    // async delete(id: Node["id"], userId: User["id"]) {
    //     const node = await this.getNodeById(id, userId);

    //     if (!node) {
    //         throw new NotFoundException("Метка не найдена");
    //     }

    //     return await this.prisma.node.delete({
    //         where: {
    //             id: id,
    //         },
    //     });
    // }
}

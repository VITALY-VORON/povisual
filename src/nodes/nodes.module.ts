import { Module } from "@nestjs/common";
import { NodesController } from "./nodes.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { NodesService } from "./nodes.service";

@Module({
    controllers: [NodesController],
    providers: [NodesService, PrismaService],
})
export class NodesModule {}

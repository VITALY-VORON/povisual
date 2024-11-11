import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { JsonConstructor } from "./json.constructor";

@Module({
    controllers: [FilesController],
    providers: [FilesService, PrismaService, JsonConstructor],
})
export class FilesModule {}

import { Module } from "@nestjs/common";
import { FilesModule } from "./files/files.module";
import { FilesController } from "./files/files.controller";
import { FilesService } from "./files/files.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { NodesModule } from "./nodes/nodes.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            isGlobal: true,
            expandVariables: true,
        }),
        AuthModule,
        UserModule,
        FilesModule,
        NodesModule,
        PrismaModule,
    ],
})
export class AppModule {}

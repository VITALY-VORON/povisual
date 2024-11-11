import { Module } from "@nestjs/common";
import { FilesModule } from "./files/files.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { NodesModule } from "./nodes/nodes.module";
import { LocationsModule } from './locations/locations.module';

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
        LocationsModule,
    ],
})
export class AppModule {}

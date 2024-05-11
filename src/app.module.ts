import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FilesModule } from './files/files.module';
import { FilesController } from './files/files.controller';
import { FilesService } from './files/files.service';

@Module({
  imports: [FilesModule],
  controllers: [FilesController],
  providers: [FilesService, PrismaService],
})
export class AppModule {}

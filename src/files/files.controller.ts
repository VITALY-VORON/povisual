import { Controller, Get, Post, UseInterceptors, ParseFilePipe, UploadedFile, MaxFileSizeValidator, Res, Param, StreamableFile, Delete, Body } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fileCandidateStorage } from './store';
import * as path from 'path';
import { Response } from 'express';
import * as fs from 'fs';
import * as archiver from 'archiver';

@Controller('files')
@ApiTags('Files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('/upload/:filename')
  @ApiOperation({ summary: 'Upload file', description: "Enter .json file to upload" })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileCandidateStorage
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  create(
    @Param('filename')
    filename: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })]
      })
    )
    file: Express.Multer.File,
  ): Promise<{
    id: number;
    filename: string;
    mediaType: string;
  } | string> {    
    return this.filesService.create(file, filename)
  }

  @Get()
  @ApiOperation({ summary: 'Get all files from database file' })
  @ApiResponse({
    status: 200, description: `
  {
    "id": 1,
    "filename": "planG1-new_Ostonovites.json",
    "mediaType": "application/json"
  }
  ` })
  getAllFiles(): Promise<{
    id: number;
    filename: string;
    mediaType: string;
  }[]> {
    return this.filesService.getAllFiles();
  }

  @Get('filename/:filename')
  @ApiOperation({ summary: 'Download file by filename', description: "Enter file name like 'package.json'" })
  getFileByName(
    @Res({ passthrough: true }) res: Response,
    @Param('filename') filename: string
  ): StreamableFile {
    const file = fs.createReadStream(path.join(process.cwd(), `uploads/${filename}.json`));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename=${filename}.json`,
    })
    return new StreamableFile(file);
  }

  @Get('fileid/:id')
  @ApiOperation({ summary: 'Download file by id', description: "Enter file id like '1'" })
  async getFileById(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: number
  ) {
    const filename = await this.filesService.getFileNameById(+id);

    const file = fs.createReadStream(path.join(process.cwd(), `uploads/${filename}.json`));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename=${filename}`,
    })

    return new StreamableFile(file);
  }

  @Get('/all')
  @ApiOperation({ summary: 'Download all files as archive' })
  async downloadAllFiles(@Res() res: Response) {
    const directoryPath = 'uploads';
    const files = await fs.promises.readdir(directoryPath);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=updates.zip',
    });

    const archive = archiver('zip');

    archive.pipe(res);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      if ((await fs.promises.stat(filePath)).isFile()) {
        archive.append(fs.createReadStream(filePath), { name: file });
      }
    }

    return await archive.finalize();
  }

  @Get('/node/:mac')
  @ApiOperation({ summary: 'Get node by mac', description: "Enter mac like '00:00:00:00:00:00'" })
  async getNodeByMac(@Param('mac') mac: string, req: Request) {
    return this.filesService.getNodeByMac(mac);
  }

  @Get('/nodes/all')
  @ApiOperation({ summary: 'Get all nodes' })
  async getAllNodes() {
    return this.filesService.getAllNodes();
  }

  @Delete("/files/delete/:id")
  @ApiOperation({ summary: 'Delete file by id', description: "Enter file id like '1'" })
  async deleteFileById(@Param('id') id: number) {
    return this.filesService.deleteFileById(+id);
  }
}

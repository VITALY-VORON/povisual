import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promisify } from 'util';
import { JsonConstructor } from './json.constructor';
import { AllNodes, newJsonData, newNode } from './file.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async getAllFiles() {
    return this.prisma.file.findMany();
  }

  async create(
    file: Express.Multer.File,
    filename: string,
  ): Promise<
    | {
        id: number;
        filename: string;
        mediaType: string;
      }
    | string
  > {
    const candidate = await this.prisma.file.findFirst({
      where: {
        filename: filename,
      },
    });

    if (candidate) {
      return 'File already exists';
    }

    const readFileAsync = promisify(fs.readFile);
    const existingData = await readFileAsync('./nodes/nodes.json', 'utf-8');

    const lenght = existingData.length;

    const data = await this.prisma.file.create({
      data: {
        filename: filename,
        mediaType: file.mimetype,
      },
    });
    await JsonConstructor.jsonConstructor(
      data.id,
      filename,
      file.originalname,
      lenght,
    );
    await this.appendToNodesFile(data, filename);
    return data;
  }

  async appendToNodesFile(
    data: {
      id: number;
      filename: string;
      mediaType: string;
    },
    filename: string,
  ) {
    try {
      const readFileAsync = promisify(fs.readFile);
      const writeFileAsync = promisify(fs.writeFile);

      const newData = await readFileAsync(
        `./uploads/${filename}.json`,
        'utf-8',
      );
      const existingData = await readFileAsync('./nodes/nodes.json', 'utf-8');

      const newFileData: newJsonData = JSON.parse(newData);
      const newNodes = newFileData.nodes.map((node) => ({
        ...node,
        location: data.id,
      }));
      const existingNodes = JSON.parse(existingData);

      const updatedNodes = existingNodes.concat(newNodes);

      await writeFileAsync('./nodes/nodes.json', JSON.stringify(updatedNodes));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getFileNameById(id: number) {
    const fileData = await this.prisma.file.findFirst({
      where: {
        id: id,
      },
    });
    return fileData.filename;
  }

  async getNodeByMac(mac: string) {
    try {
      const readFileAsync = promisify(fs.readFile);
      const existingData = await readFileAsync('./nodes/nodes.json', 'utf-8');
      const allNodes: newNode[] = JSON.parse(existingData);
      const node = allNodes.find((n) => n.beacon.mac === mac);
      return {
        id: node.id,
        mac: node.beacon.mac,
        location: node.location,
        name: node.name,
      };
    } catch (e) {
      console.log(e);
    }
  }

  async getAllNodes() {
    const readFileAsync = promisify(fs.readFile);
    const allNodes = await readFileAsync('./nodes/nodes.json', 'utf-8');
    return allNodes;
  }

  async deleteFileById(id: number) {
    const { filename } = await this.prisma.file.findFirst({
      where: {
        id: id,
      },
    });

    if (!filename) {
      return 'File does not exist';
    }

    fs.promises.unlink(`./uploads/${filename}.json`);

    const readFileAsync = promisify(fs.readFile);
    const existingData = await readFileAsync('./nodes/nodes.json', 'utf-8');
    const allNodes: AllNodes[] = JSON.parse(existingData);

    const updatedNodes = allNodes.filter((n) => n.beacon.id !== id);

    fs.writeFileSync('./nodes/nodes.json', JSON.stringify(updatedNodes));

    return await this.prisma.file.delete({
      where: {
        id: id,
      },
    });
  }
}

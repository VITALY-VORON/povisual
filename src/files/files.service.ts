import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import { promisify } from "util";
import { JsonConstructor } from "./json.constructor";
import { AllNodes, newJsonData, newNode } from "./file.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FilesService {
    constructor(
        private prisma: PrismaService,
        private jsonConstructor: JsonConstructor,
    ) {}

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
            return "File already exists";
        }

        const data = await this.prisma.file.create({
            data: {
                filename: filename,
                mediaType: file.mimetype,
            },
        });

        await this.jsonConstructor.jsonConstructor(data.id, filename, file.originalname);
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

            const newData = await readFileAsync(`./uploads/${filename}.json`, "utf-8");
            const existingData = await readFileAsync("./nodes/nodes.json", "utf-8");

            const newFileData: newJsonData = JSON.parse(newData);
            const newNodes = newFileData.nodes.map((node) => ({
                ...node,
                location: data.id,
            }));
            const existingNodes = JSON.parse(existingData);

            const updatedNodes = existingNodes.concat(newNodes);

            await writeFileAsync("./nodes/nodes.json", JSON.stringify(updatedNodes));
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
        return fileData?.filename;
    }

    async getNodeByMac(mac: string) {
        try {
            const readFileAsync = promisify(fs.readFile);
            const existingData = await readFileAsync("./nodes/nodes.json", "utf-8");
            const allNodes: newNode[] = JSON.parse(existingData);
            const node = allNodes.find((n) => n.beacon.mac === mac);
            return node
                ? {
                      id: node.id,
                      mac: node.beacon.mac,
                      location: node.location,
                      name: node.name,
                  }
                : null;
        } catch (e) {
            console.log(e);
        }
    }

    async getAllNodes() {
        const readFileAsync = promisify(fs.readFile);
        const allNodes = await readFileAsync("./nodes/nodes.json", "utf-8");
        return allNodes;
    }

    async deleteFileById(id: number) {
        const fileData = await this.prisma.file.findFirst({
            where: {
                id: id,
            },
        });

        if (!fileData?.filename) {
            return "File does not exist";
        }

        await fs.promises.unlink(`./uploads/${fileData.filename}.json`);

        const readFileAsync = promisify(fs.readFile);
        const existingData = await readFileAsync("./nodes/nodes.json", "utf-8");
        const allNodes: AllNodes[] = JSON.parse(existingData);

        const updatedNodes = allNodes.filter((n) => n.beacon.id !== id);

        await fs.promises.writeFile("./nodes/nodes.json", JSON.stringify(updatedNodes));

        return this.prisma.file.delete({
            where: {
                id: id,
            },
        });
    }

    async getFileFromDB(id: number) {
        const res = await this.prisma.locationFile.findUnique({
            where: { id },
            include: { nodes: { include: { beacon: true } }, edges: true },
        });

        const nodes = res.nodes.map((n) => {
            return {
                id: n.idInFile,
                nodeId: n.nodeId,
                name: n.name,
                coordinate_x: n.coordinate_x,
                coordinate_y: n.coordinate_y,
                text: n.text,
                beacon: { id: n.beacon.idInFile, mac: n.beacon.mac, name: n.beacon.name },
                text_broadcast: n.text_broadcast,
                is_destination: n.is_destination,
                is_phantom: n.is_phantom,
                is_turns_verbose: n.is_turns_verbose,
            };
        });

        const edges = res.edges.map((e) => {
            return {
                start: e.start,
                stop: e.stop,
                weight: e.weight,
                text: e.text,
            };
        });

        const data = {
            id: res.idInFile,
            name: res.name,
            text: res.text,
            nodes: nodes,
            edges: edges,
            is_old_turns: res.is_old_turns,
            azimut: res.is_old_turns,
        };

        return data;
    }
}

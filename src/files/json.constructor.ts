import * as fs from "fs";
import { promisify } from "util";
import { Injectable } from "@nestjs/common";
import { JsonData, newJsonData } from "./file.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { BeaconNode, NodeFile } from "@prisma/client";

@Injectable()
export class JsonConstructor {
    constructor(private readonly prisma: PrismaService) {}

    async jsonConstructor(id: number, filename: string, originalname: string) {
        const readFileAsync = promisify(fs.readFile);
        const data = await readFileAsync(`./candidate/${originalname}`, "utf8");
        const json: JsonData = JSON.parse(data);

        const newJsonData = await this.convertor(json, id);

        this.normalizeEdges(newJsonData);

        const newJsonDataString = JSON.stringify(newJsonData);

        fs.writeFileSync(`./uploads/${filename}.json`, newJsonDataString);
        await fs.promises.unlink(`./candidate/${originalname}`);
    }

    private async convertor(json: JsonData, id: number) {
        const newNodes: newJsonData["nodes"] = json.state.data[0].nodes.map((node, index) => ({
            id: index + 1,
            nodeId: node.id,
            name: node.name,
            coordinate_x: node.x,
            coordinate_y: node.y,
            text: node.events,
            beacon: {
                id: id,
                mac: node.mac,
                name: node.name,
            },
            text_broadcast: node.broadcast,
            is_destination: node.isDestinct,
            is_phantom: node.isPhantom,
            is_turns_verbose: false,
        }));

        const l = await this.prisma.locationFile.create({
            data: {
                name: json.name,
                text: null,
                idInFile: id,
                is_old_turns: true,
                azimut: null,
            },
        });

        await this.prisma.file.update({
            where: { id: id },
            data: {
                locationFile: { connect: { id: l.id } },
            },
        });

        for (const node of newNodes) {
            const newNode: Omit<NodeFile, "id"> = {
                idInFile: node.id,
                nodeId: node.nodeId,
                name: node.name,
                coordinate_x: node.coordinate_x,
                coordinate_y: node.coordinate_y,
                text: node.text,
                text_broadcast: node.text_broadcast,
                is_destination: node.is_destination,
                is_phantom: node.is_phantom,
                is_turns_verbose: node.is_turns_verbose,
                locationId: l.id,
            };

            const newBeacon: Omit<BeaconNode, "id"> = {
                idInFile: node.beacon.id,
                name: node.beacon.name,
                mac: node.beacon.mac,
                nodeFileId: node.id,
            };

            const n = await this.prisma.nodeFile.create({ data: newNode });
            const b = await this.prisma.beaconNode.create({ data: newBeacon });
            await this.prisma.nodeFile.update({
                where: { id: n.id },
                data: { beacon: { connect: { id: b.id } } },
            });
            await this.prisma.locationFile.update({
                where: { id: l.id },
                data: { nodes: { connect: { id: n.id } } },
            });
        }

        const newEdges: newJsonData["edges"] = json.state.data[0].links.map((link) => ({
            start: link.source,
            stop: link.target,
            weight: link.weight,
            text: link.events,
        }));

        for (const edge of newEdges) {
            const e = await this.prisma.edgeFile.create({ data: edge });
            await this.prisma.locationFile.update({
                where: { id: l.id },
                data: { edges: { connect: { id: e.id } } },
            });
        }

        const NewJsonData: newJsonData = {
            id: id,
            name: json.name,
            text: null,
            nodes: newNodes,
            edges: newEdges,
            is_old_turns: true,
            azimut: null,
        };

        return NewJsonData;
    }

    private normalizeEdges(data: newJsonData) {
        const nodeIdMap = new Map<string | number, number>();
        data.nodes.forEach((node) => {
            nodeIdMap.set(node.nodeId, node.id);
        });

        data.edges.forEach((edge) => {
            if (typeof edge.start === "string" && nodeIdMap.has(edge.start)) {
                edge.start = nodeIdMap.get(edge.start)!;
            }
            if (typeof edge.stop === "string" && nodeIdMap.has(edge.stop)) {
                edge.stop = nodeIdMap.get(edge.stop)!;
            }
        });
    }
}

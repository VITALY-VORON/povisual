import * as fs from 'fs';
import { promisify } from 'util';
import { Injectable } from '@nestjs/common';
import { JsonData, newJsonData } from './file.dto';

@Injectable()
export class JsonConstructor {
    static async jsonConstructor(id: number, filename: string, originalname: string) {
        const readFileAsync = promisify(fs.readFile);
        const data = await readFileAsync(`./candidate/${originalname}`, 'utf8');
        const json: JsonData = JSON.parse(data);

        const newJsonData = this.convertor(json, id, filename);

        const newJsonDataString = JSON.stringify(newJsonData);

        fs.writeFileSync(`./uploads/${filename}.json`, newJsonDataString);
        fs.promises.unlink(`./candidate/${originalname}`)
    }

    static convertor(json: JsonData, id: number, filename: string) {

        const newNodes: newJsonData['nodes'] = json.state.data[0].nodes.map(node => ({
            id: node.id,
            name: node.name,
            coordinate_x: node.x,
            coordinate_y: node.y,
            text: node.events,
            beacon: {
                id: id,
                mac: node.mac,
                name: node.name
            },
            text_broadcast: node.broadcast,
            is_destination: true,
            is_phantom: node.isPhantom,
            is_turns_verbose: false,
        }));

        const newEdges: newJsonData['edges'] = json.links.map(link => ({
            start: Number(link.source),
            stop: Number(link.target),
            weight: link.weight,
            text: link.events,
        }));

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
}

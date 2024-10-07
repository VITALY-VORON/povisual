import * as fs from 'fs';
import { promisify } from 'util';
import { Injectable } from '@nestjs/common';
import { JsonData, newJsonData } from './file.dto';

@Injectable()
export class JsonConstructor {
  static async jsonConstructor(
    id: number,
    filename: string,
    originalname: string,
    length: number,
  ) {
    const readFileAsync = promisify(fs.readFile);
    const data = await readFileAsync(`./candidate/${originalname}`, 'utf8');
    const json: JsonData = JSON.parse(data);

    const newJsonData = this.convertor(json, id);

    // Normalize edges
    this.normalizeEdges(newJsonData);

    const newJsonDataString = JSON.stringify(newJsonData);

    fs.writeFileSync(`./uploads/${filename}.json`, newJsonDataString);
    await fs.promises.unlink(`./candidate/${originalname}`);
  }

  static convertor(json: JsonData, id: number) {
    const newNodes: newJsonData['nodes'] = json.state.data[0].nodes.map(
      (node, index) => ({
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
      }),
    );

    const newEdges: newJsonData['edges'] = json.state.data[0].links.map(
      (link) => ({
        start: link.source,
        stop: link.target,
        weight: link.weight,
        text: link.events,
      }),
    );

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

  static normalizeEdges(data: newJsonData) {
    const nodeIdMap = new Map<string | number, number>();
    data.nodes.forEach((node) => {
      nodeIdMap.set(node.nodeId, node.id);
    });

    data.edges.forEach((edge) => {
      if (typeof edge.start === 'string' && nodeIdMap.has(edge.start)) {
        edge.start = nodeIdMap.get(edge.start);
      }
      if (typeof edge.stop === 'string' && nodeIdMap.has(edge.stop)) {
        edge.stop = nodeIdMap.get(edge.stop);
      }
    });
  }
}

import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { NodesService } from "./nodes.service";
import { ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateNodeDto } from "./create.node.dto";
import { Node, Location } from "@prisma/client";

@Controller("nodes")
@ApiTags("Nodes")
export class NodesController {
    constructor(private readonly nodesService: NodesService) {}

    @Post("create/:id")
    // @Auth()
    // @ApiBearerAuth()
    @ApiBody({
        type: CreateNodeDto,
    })
    @ApiParam({
        name: "id",
        description: "Location ID",
        type: "number",
        required: true,
    })
    async create(@Body() data: Omit<Node, "id" | "locationid">, @Param("id") id: Location["id"]) {
        return await this.nodesService.create(data, +id);
    }

    @Get("get/:id")
    // @Auth()
    // @ApiBearerAuth()
    @ApiParam({ name: "id", description: "Node ID" })
    async getNodeById(@Param("id") nodeId: Node["id"]) {
        return await this.nodesService.getNodeById(+nodeId);
    }

    @Get("all/")
    // @Auth()
    // @ApiBearerAuth()
    // @ApiParam({ name: 'userId', description: 'User ID' })
    async getAllNodes() {
        return await this.nodesService.getAllNodes();
    }

    // @Put("edit")
    // @Auth()
    // @ApiBearerAuth()
    // async edit(@Body() data: UpdateNodeDto, @CurrentUser("id") id: User["id"]) {
    //     console.log(data);
    //     return await this.nodesService.edit(data, id);
    // }

    // @Delete("delete/:id")
    // @Auth()
    // @ApiBearerAuth()
    // @ApiParam({ name: "id", description: "Node ID" })
    // async delete(@Param("id") nodeId: number, @CurrentUser("id") id: User["id"]) {
    //     return await this.nodesService.delete(nodeId, id);
    // }
}

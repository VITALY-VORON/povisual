import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { NodesService } from "./nodes.service";
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateNodeDto, UpdateNodeDto } from "./create.node.dto";
import { Node, User } from "@prisma/client";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/user/decorators/user.decorator";

@Controller("nodes")
@ApiTags("Nodes")
export class NodesController {
    constructor(private readonly nodesService: NodesService) {}

    @Post("create")
    @Auth()
    @ApiBearerAuth()
    @ApiBody({
        type: CreateNodeDto,
    })
    async create(@Body() data: CreateNodeDto, @CurrentUser("id") id: User["id"]) {
        return await this.nodesService.create(data, id);
    }

    @Get("get/:id")
    @Auth()
    @ApiBearerAuth()
    @ApiParam({ name: "id", description: "Node ID" })
    async getNodeById(@Param("id") nodeId: Node["id"], @CurrentUser("id") id: User["id"]) {
        return await this.nodesService.getNodeById(+nodeId, id);
    }

    @Get("all/")
    @Auth()
    @ApiBearerAuth()
    // @ApiParam({ name: 'userId', description: 'User ID' })
    async getAllNodes(@CurrentUser("id") id: User["id"]) {
        return await this.nodesService.getAllNodes(id);
    }

    @Put("edit")
    @Auth()
    @ApiBearerAuth()
    async edit(@Body() data: UpdateNodeDto, @CurrentUser("id") id: User["id"]) {
        console.log(data);
        return await this.nodesService.edit(data, id);
    }

    @Delete("delete/:id")
    @Auth()
    @ApiBearerAuth()
    @ApiParam({ name: "id", description: "Node ID" })
    async delete(@Param("id") nodeId: number, @CurrentUser("id") id: User["id"]) {
        return await this.nodesService.delete(nodeId, id);
    }
}

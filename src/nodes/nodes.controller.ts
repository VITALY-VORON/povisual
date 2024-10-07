import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NodesService } from './nodes.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateNodeDto, UpdateNodeDto } from './create.node.dto';
import { Node, User } from '@prisma/client';

@Controller('nodes')
@ApiTags('Nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Post('create')
  @ApiBody({
    type: CreateNodeDto,
  })
  async create(@Body() data: CreateNodeDto) {
    return await this.nodesService.create(data);
  }

  @Get('get/:id')
  @ApiParam({ name: 'id', description: 'Node ID' })
  async getNodeById(@Param('id') id: Node['id']) {
    return await this.nodesService.getNodeById(+id);
  }

  @Get('all/:userId')
  @ApiParam({ name: 'userId', description: 'User ID' })
  async getAllNodes(@Param('userId') userId: User['id']) {
    return await this.nodesService.getAllNodes(userId);
  }

  @Put('edit')
  async edit(@Body() data: UpdateNodeDto) {
    return await this.nodesService.edit(data);
  }

  @Delete('delete/:id')
  @ApiParam({ name: 'id', description: 'Node ID' })
  async delete(@Param('id') id: number) {
    return await this.nodesService.delete(id);
  }
}

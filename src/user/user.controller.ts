import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PasswordInterceptor } from 'src/interceptors/password.interceptor';

@Controller('user')
@ApiTags('User')
@UseInterceptors(PasswordInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me/:id')
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
    format: 'uuid',
    required: true,
  })
  async getMe(@Param('id') id: User['id']) {
    return this.userService.getById(id);
  }

  @Get(':email')
  @ApiParam({
    name: 'email',
    description: 'User email',
    type: 'string',
    format: 'email',
    required: true,
  })
  getByEmail(@Param('email') email: User['email']) {
    return this.userService.getByEmail(email);
  }
}

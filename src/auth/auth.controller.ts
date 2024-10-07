import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreateUserDto, LoginUserDto } from 'src/user/create.user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiBody({
    type: LoginUserDto,
  })
  login(@Body() data: Omit<User, 'id' | 'name'>) {
    return this.authService.login(data);
  }

  @Post('/register')
  @ApiBody({
    type: CreateUserDto,
  })
  register(@Body() data: Omit<User, 'id'>) {
    return this.authService.register(data);
  }
}

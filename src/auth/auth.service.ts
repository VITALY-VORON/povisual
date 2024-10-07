import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(data: Omit<User, 'id' | 'name'>) {
    const user = await this.userService.getByEmail(data.email);
    if (!user) return new NotFoundException('User not found');
    const confirmPassword = bcrypt.compareSync(data.password, user.password);
    if (!confirmPassword)
      return new UnauthorizedException('Invalid email or password');
    return { userId: user.id };
  }

  async register(data: Omit<User, 'id'>) {
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const newUser = await this.userService.create({
      ...data,
      password: hashedPassword,
    });
    return { userId: newUser.id };
  }
}

import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { UserService } from "src/user/user.service";

import { JwtService } from "@nestjs/jwt";

import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwt: JwtService,
    ) {}

    async login(dto: Omit<User, "id" | "name" | "role" | "avatarUrl">) {
        const user = await this.validateUser(dto);

        const tokens = this.issueTokens(user.id);

        delete user["password"];

        return {
            user,
            ...tokens,
        };
    }

    async register(dto: Omit<User, "id">) {
        const oldUser = await this.userService.getByEmail(dto.email);

        if (oldUser) throw new BadRequestException("Пользователь с таким email уже существует");

        const hash = bcrypt.hashSync(dto.password, 10);
        const newUser = {
            ...dto,
            password: hash,
        };

        const user = await this.userService.create(newUser);

        const tokens = this.issueTokens(user.id);

        delete user["password"];

        return {
            user,
            ...tokens,
        };
    }

    async getNewTokens(refreshToken: string) {
        const result = await this.jwt.verify(refreshToken);
        if (!result) throw new UnauthorizedException("Невалидный refresh токен");

        const user = await this.userService.getById(result.id);

        const tokens = this.issueTokens(user.id);

        return {
            user,
            ...tokens,
        };
    }

    private issueTokens(userId: User["id"]) {
        const data = { id: userId };

        const accessToken = this.jwt.sign(data, {
            expiresIn: "1h",
        });

        const refreshToken = this.jwt.sign(data, {
            expiresIn: "7d",
        });

        return { accessToken, refreshToken };
    }

    private async validateUser(dto: Omit<User, "id" | "name" | "role" | "avatarUrl">) {
        const user = await this.userService.getByEmail(dto.email);

        if (!user) throw new NotFoundException("Пользователь не найден");

        const isValidPassword = await bcrypt.compare(user.password, dto.password);

        if (!isValidPassword) throw new UnauthorizedException("Неверный email или пароль");

        return user;
    }
}

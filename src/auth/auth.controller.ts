import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { CreateUserDto, LoginUserDto } from "src/user/create.user.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/login")
    @ApiBody({
        type: LoginUserDto,
    })
    login(@Body() data: Omit<User, "id" | "name" | "role" | "avatarUrl">) {
        return this.authService.login(data);
    }

    @Post("/register")
    @ApiBody({
        type: CreateUserDto,
    })
    register(@Body() data: Omit<User, "id">) {
        return this.authService.register(data);
    }

    @Post("login/access-token")
    @ApiBody({
        type: RefreshTokenDto,
    })
    @ApiBearerAuth()
    async getNewTokens(@Body() dto: RefreshTokenDto) {
        return this.authService.getNewTokens(dto.refreshToken);
    }
}

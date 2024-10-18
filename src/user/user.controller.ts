import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "@prisma/client";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { PasswordInterceptor } from "src/interceptors";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "./decorators/user.decorator";

@Controller("user")
@ApiTags("User")
@UseInterceptors(PasswordInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("me")
    @Auth()
    @ApiBearerAuth()
    async getMe(@CurrentUser("id") id: User["id"]) {
        return await this.userService.getById(id);
    }

    @Get(":email")
    @Auth("admin")
    @ApiBearerAuth()
    @ApiParam({
        name: "email",
        description: "User email",
        type: "string",
        format: "email",
        required: true,
    })
    async getByEmail(@Param("email") email: User["email"]) {
        const user = await this.userService.getByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}

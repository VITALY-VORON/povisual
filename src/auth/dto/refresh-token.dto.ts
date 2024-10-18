import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenDto {
    @IsString({
        message: "Вы не передали refresh токен или это не строка!",
    })
    @ApiProperty()
    refreshToken: string;
}

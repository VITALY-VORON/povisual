import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto implements Omit<User, "id" | "role" | "avatarUrl"> {
    @ApiProperty()
    @IsEmail()
    email: string;
    @ApiProperty()
    @IsString()
    @MinLength(8)
    password: string;
    @ApiProperty()
    @IsString()
    @MinLength(2)
    name: string;
}

export class LoginUserDto {
    @ApiProperty()
    @IsEmail()
    email: string;
    @ApiProperty()
    @IsString()
    @MinLength(8)
    password: string;
}

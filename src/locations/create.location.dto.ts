import { ApiProperty } from "@nestjs/swagger";
import { Location } from "@prisma/client";
import { IsBoolean, IsString } from "class-validator";

export class CreateLocationDto implements Omit<Location, "id"> {
    @ApiProperty()
    @IsString()
    userid: string;
    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsBoolean()
    visibility: boolean;
    @ApiProperty()
    @IsString()
    userId: string;
}

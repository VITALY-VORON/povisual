import { ApiProperty } from "@nestjs/swagger";
import { Node } from "@prisma/client";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateNodeDto implements Omit<Node, "id" | "userId"> {
    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsString()
    text: string;
    @ApiProperty()
    @IsString()
    text_broadcast: string;
    @ApiProperty()
    @IsNumber()
    location: number;
}

export class UpdateNodeDto extends CreateNodeDto {
    @ApiProperty()
    @IsNumber()
    id: number;
}

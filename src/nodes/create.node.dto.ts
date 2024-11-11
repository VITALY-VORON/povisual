import { ApiProperty } from "@nestjs/swagger";
import { Node } from "@prisma/client";
import { IsNumber, IsString } from "class-validator";

export class CreateNodeDto implements Omit<Node, "id" | "locationId"> {
    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsString()
    text_broadcast: string;
}

export class UpdateNodeDto extends CreateNodeDto {
    @ApiProperty()
    @IsNumber()
    id: number;
}

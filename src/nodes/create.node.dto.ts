import { ApiProperty } from "@nestjs/swagger";
import { Node } from "@prisma/client";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateNodeDto implements Omit<Node, "id" | "userId"> {
    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsNumber()
    coordinate_x: number;
    @ApiProperty()
    @IsNumber()
    coordinate_y: number;
    @ApiProperty()
    @IsString()
    text: string;
    @ApiProperty()
    @IsString()
    text_broadcast: string;
    @ApiProperty()
    @IsBoolean()
    is_destination: boolean;
    @ApiProperty()
    @IsBoolean()
    is_phantom: boolean;
    @ApiProperty()
    @IsBoolean()
    is_turns_verbose: boolean;
    @ApiProperty()
    @IsNumber()
    location: number;
}

export class UpdateNodeDto extends CreateNodeDto {
    @ApiProperty()
    @IsNumber()
    id: number;
}

import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { LocationsService } from "./locations.service";
import { Location } from "@prisma/client";
import { ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateLocationDto } from "./create.location.dto";

@Controller("locations")
@ApiTags("Location")
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

    @Post("create")
    @ApiBody({
        type: CreateLocationDto,
    })
    async create(@Body() data: Omit<Location, "id">) {
        console.log(data);

        return await this.locationsService.createLocation(data);
    }

    @Get("all")
    async getAll() {
        return await this.locationsService.getAllLocations();
    }

    @Get("get/:id")
    @ApiParam({
        name: "id",
        description: "Location ID",
        type: "number",
        required: true,
    })
    async getLocationById(@Param("id") id: Location["id"]) {
        return await this.locationsService.getLocationById(+id);
    }
}

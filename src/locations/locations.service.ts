import { Injectable } from "@nestjs/common";
import { Location } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class LocationsService {
    constructor(private readonly prisma: PrismaService) {}

    async createLocation(data: Omit<Location, "id">): Promise<any> {
        const location = await this.prisma.location.create({ data });
        await this.prisma.user.update({
            where: { id: data.userId },
            data: { locations: { connect: { id: location.id } } },
        });
        return location;
    }

    async getAllLocations(): Promise<Location[]> {
        const locations = await this.prisma.location.findMany();
        locations.map((location: Location) => {
            delete location["userid"];
        });
        return locations;
    }

    async getLocationById(id: Location["id"]): Promise<Location | null> {
        return await this.prisma.location.findUnique({
            where: { id },
            include: {
                nodes: true,
            },
        });
    }
}

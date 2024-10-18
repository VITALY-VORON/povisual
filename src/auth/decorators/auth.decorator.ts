import { UseGuards, applyDecorators } from "@nestjs/common";
import { OnlyAdminGuard } from "../guards/admin.guard";
import { JwtAuthGuard } from "../guards/jwt.guard";

export type TypeRole = "admin" | "user";

export function Auth(role: TypeRole = "user") {
    return applyDecorators(
        role === "admin" ? UseGuards(JwtAuthGuard, OnlyAdminGuard) : UseGuards(JwtAuthGuard),
    );
}

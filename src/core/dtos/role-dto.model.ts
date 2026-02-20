import { ApiProperty } from "@nestjs/swagger";
import { RoleModel } from "../models";
import { BaseDTOModel } from "./base";

export class RoleDTO extends BaseDTOModel {
    @ApiProperty({type: 'string' })
    id: string;
    @ApiProperty({type: 'string' })
    name: string;
    @ApiProperty({type: 'string' })
    description: string | undefined;

    fromRole(data: RoleModel): RoleDTO {
        const result = new RoleDTO();
        result.id = data.id;
        result.name = data.name;
        result.description = data.description;
        result.isActive = data.isActive;
        result.createdAt = data.createdAt;
        result.createdBy = data.createdBy;
        result.updatedAt = data.updatedAt;
        result.updatedBy = data.updatedBy;
        return result;
    }

    toRole(data: RoleDTO): RoleModel {
        const result = new RoleModel();
        result.id = data.id;
        result.name = data.name;
        result.description = data.description;
        result.isActive = data.isActive;
        result.createdAt = data.createdAt;
        result.createdBy = data.createdBy;
        result.updatedAt = data.updatedAt;
        result.updatedBy = data.updatedBy;
        return result;
    }
}
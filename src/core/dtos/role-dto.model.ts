import { ApiProperty } from "@nestjs/swagger";
import { RoleModel } from "../models";

export class RoleDTO {
    @ApiProperty({type: 'string' })
    id: string;
    @ApiProperty({type: 'string' })
    name: string;
    @ApiProperty({type: 'string' })
    description: string | undefined;

    @ApiProperty({type: 'boolean' })
    isActive: boolean;

    @ApiProperty({type: 'string', example: new Date() })
    createdAt: Date;
    @ApiProperty({type: 'string' })
    createdBy: string;
    @ApiProperty({type: 'string', example: new Date() })
    updatedAt: Date;
    @ApiProperty({type: 'string' })
    updatedBy: string;

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
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../models";

export class UserDTO {
    @ApiProperty({type: 'string' })
    id: string;
    @ApiProperty({type: 'string' })
    username: string;
    @ApiProperty({type: 'string' })
    email: string | undefined;
    @ApiProperty({type: 'string' })
    password: string | undefined;
    @ApiProperty({type: 'string' })
    roleId: string;
    @ApiProperty({type: 'string' })
    companyId: string;

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

    fromUser(data: User): UserDTO {
        const result = new UserDTO();
        result.id = data.id;
        result.username = data.username;
        result.email = data.email;
        // result.password = data.password;
        result.roleId = data.roleId;
        result.companyId = data.companyId;
        // result.role = data.role;
        result.isActive = data.isActive;
        result.createdAt = data.createdAt;
        result.createdBy = data.createdBy;
        result.updatedAt = data.updatedAt;
        result.updatedBy = data.updatedBy;
        return result;
    }

    toUser(data: UserDTO): User {
        const result = new User();
        result.id = data.id;
        result.username = data.username;
        result.email = data.email;
        result.password = data.password;
        result.roleId = data.roleId;
        result.companyId = data.companyId;
        // result.role = data.role;
        result.isActive = data.isActive;
        result.createdAt = data.createdAt;
        result.createdBy = data.createdBy;
        result.updatedAt = data.updatedAt;
        result.updatedBy = data.updatedBy;
        return result;
    }
}
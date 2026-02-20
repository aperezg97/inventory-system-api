import { ApiProperty } from "@nestjs/swagger";
import { User } from "../models";
import { BaseDTOModel } from "./base";

export class UserDTO extends BaseDTOModel {
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
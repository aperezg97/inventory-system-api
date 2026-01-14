import { ApiProperty } from "@nestjs/swagger";
import { User } from "../models";

export class UserDTO {
    @ApiProperty({type: 'string' })
    id: string;
    @ApiProperty({type: 'string' })
    firstName: string;
    @ApiProperty({type: 'string' })
    lastName: string;
    @ApiProperty({type: 'string' })
    email: string;
    @ApiProperty({type: 'string' })
    username: string;
    @ApiProperty({type: 'string' })
    password: string;
    @ApiProperty({type: 'string', example: new Date() })
    created_at: Date;
    @ApiProperty({type: 'string' })
    created_by: string;
    @ApiProperty({type: 'string', example: new Date() })
    updated_at: Date;
    @ApiProperty({type: 'string' })
    updated_by: string;

    fromUser(user: User): UserDTO {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            created_at: user.created_at,
            // created_by: user.created_by,
            // updated_at: user.updated_at,
            // updated_by: user.updated_by,
        } as UserDTO;
    }

    toUser(userDto: UserDTO): User {
        return {
            id: userDto.id,
            firstName: userDto.firstName,
            lastName: userDto.lastName,
            username: userDto.username,
            email: userDto.email,
            created_at: userDto.created_at,
            // created_by: userDto.created_by,
            // updated_at: userDto.updated_at,
            // updated_by: userDto.updated_by,
            // isActive: userDto.isActive,
        } as User;
    }
}
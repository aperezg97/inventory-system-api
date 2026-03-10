import { ApiProperty } from "@nestjs/swagger";
import { BaseModel } from "./base.model";
import { RoleModel } from "./role.model";

export class User extends BaseModel {
    @ApiProperty()
    id: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    email: string | undefined;
    @ApiProperty()
    password: string | undefined;
    @ApiProperty()
    roleId: string;
    @ApiProperty()
    companyId: string;

    @ApiProperty({type: RoleModel})
    role: RoleModel;
}
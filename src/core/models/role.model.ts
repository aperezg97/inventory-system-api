import { ApiProperty } from "@nestjs/swagger";
import { BaseModel } from "./base.model";

export class RoleModel extends BaseModel {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string | undefined;
}
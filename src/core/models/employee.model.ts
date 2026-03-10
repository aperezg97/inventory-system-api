import { ApiProperty } from "@nestjs/swagger";
import { BaseModel } from "./base.model";
import { User } from "./user.model";

export class Employee extends BaseModel {
    @ApiProperty()
    id: string;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    address: string;
    @ApiProperty()
    phoneNumber: string;
    @ApiProperty()
    profileImageUrl: string | undefined;

    @ApiProperty()
    branchOfficeId: string;
    @ApiProperty()
    companyId: string;
    @ApiProperty()
    userId: string;

    @ApiProperty()
    user: User | undefined;
}
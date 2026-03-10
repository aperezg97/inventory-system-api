import { ApiProperty } from "@nestjs/swagger";
import { BaseModel } from "./base.model";
import { BranchOfficeModel } from "./branch-office.model";

export class CompanyModel extends BaseModel {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    address: string;
    @ApiProperty()
    rucNumber: string;
    @ApiProperty()
    dgiLicenseNumber: string;
    @ApiProperty()
    phoneNumber: string;
    @ApiProperty()
    logoUrl: string;
    @ApiProperty()
    mainBranchOfficeId: string;
    @ApiProperty({type: BranchOfficeModel})
    mainBranchOffice: BranchOfficeModel | undefined;
}
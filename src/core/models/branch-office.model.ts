import { ApiProperty } from "@nestjs/swagger";
import { BaseModel } from "./base.model"
import { CompanyModel } from "./company.model";

export class BranchOfficeModel extends BaseModel {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    address: string;
    @ApiProperty()
    phoneNumber: string;
    @ApiProperty()
    logoUrl: string;
    @ApiProperty()
    notes: string;
    @ApiProperty()
    companyId: string;
    @ApiProperty({type: CompanyModel})
    company: CompanyModel | undefined;
}
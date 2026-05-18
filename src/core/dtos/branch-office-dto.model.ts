import { ApiProperty } from "@nestjs/swagger";
import { BaseDTOModel } from "./base";
import { BranchOfficeModel, CompanyModel } from "../models";
import { CompanyDTO } from "./company-dto.model";

export class BranchOfficeDTO extends BaseDTOModel {
    @ApiProperty()
    id!: string;
    @ApiProperty()
    name!: string;
    @ApiProperty()
    address?: string;
    @ApiProperty()
    phoneNumber?: string;
    @ApiProperty()
    logoUrl?: string;
    @ApiProperty()
    notes?: string;
    @ApiProperty()
    companyId!: string;
    @ApiProperty({ type: CompanyDTO })
    company: CompanyDTO | undefined;

    fromBranchOffice(branchOffice: BranchOfficeModel): BranchOfficeDTO {
        const result = new BranchOfficeDTO();
        result.id = branchOffice.id;
        result.name = branchOffice.name;
        result.address = branchOffice.address;
        result.phoneNumber = branchOffice.phoneNumber;
        result.logoUrl = branchOffice.logoUrl;
        result.notes = branchOffice.notes;
        result.companyId = branchOffice.companyId;
        result.company = branchOffice.company ? new CompanyDTO().fromCompany(branchOffice.company!) : undefined;
        return result;
    }

    toBranchOffice(branchOffice: BranchOfficeDTO): BranchOfficeModel {
        const result = new BranchOfficeModel();
        result.id = branchOffice.id;
        result.name = branchOffice.name;
        result.address = branchOffice.address;
        result.phoneNumber = branchOffice.phoneNumber;
        result.logoUrl = branchOffice.logoUrl;
        result.notes = branchOffice.notes;
        result.companyId = branchOffice.companyId;
        result.company = branchOffice.company ? new CompanyDTO().toCompany(branchOffice.company!) : undefined;
        return result;
    }
}
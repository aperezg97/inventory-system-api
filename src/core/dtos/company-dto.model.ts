import { ApiProperty } from "@nestjs/swagger";
import { BaseDTOModel } from "./base";
import { CompanyModel } from "../models";
import { BranchOfficeDTO } from "./branch-office-dto.model";

export class CompanyDTO extends BaseDTOModel {
    @ApiProperty()
    id!: string;
    @ApiProperty()
    name!: string;
    @ApiProperty()
    address!: string;
    @ApiProperty()
    rucNumber?: string;
    @ApiProperty()
    dgiLicenseNumber?: string;
    @ApiProperty()
    phoneNumber?: string;
    @ApiProperty()
    logoUrl?: string;
    @ApiProperty()
    mainBranchOfficeId?: string;
    @ApiProperty({ type: BranchOfficeDTO })
    mainBranchOffice?: BranchOfficeDTO | undefined;

    fromCompany(company: CompanyModel): CompanyDTO {
        const result = new CompanyDTO();
        result.id = company.id;
        result.name = company.name;
        result.address = company.address;
        result.rucNumber = company.rucNumber;
        result.dgiLicenseNumber = company.dgiLicenseNumber;
        result.phoneNumber = company.phoneNumber;
        result.logoUrl = company.logoUrl;
        result.mainBranchOfficeId = company.mainBranchOfficeId;
        result.mainBranchOffice = company.mainBranchOffice ? new BranchOfficeDTO().fromBranchOffice(company.mainBranchOffice) : undefined;
        return result;
    }

    toCompany(company: CompanyDTO): CompanyModel {
        const result = new CompanyModel();
        result.id = company.id;
        result.name = company.name;
        result.address = company.address;
        result.rucNumber = company.rucNumber;
        result.dgiLicenseNumber = company.dgiLicenseNumber;
        result.phoneNumber = company.phoneNumber;
        result.logoUrl = company.logoUrl;
        result.mainBranchOfficeId = company.mainBranchOfficeId;
        result.mainBranchOffice = company.mainBranchOffice ? new BranchOfficeDTO().toBranchOffice(company.mainBranchOffice) : undefined;
        return result;
    }
}
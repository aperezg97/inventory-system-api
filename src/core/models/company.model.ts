import { BaseModel } from "./base.model";
import { BranchOfficeModel } from "./branch-office.model";

export class CompanyModel extends BaseModel {
    id: string;
    name: string;
    address: string;
    rucNumber: string;
    dgiLicenseNumber: string;
    phoneNumber: string;
    logoUrl: string;
    mainBranchOfficeId: string;
    mainBranchOffice: BranchOfficeModel | undefined;
}
import { BaseModel } from "./base.model"
import { CompanyModel } from "./company.model";

export class BranchOfficeModel extends BaseModel {
    id: string;
    name: string;
    address: string;
    phoneNumber: string;
    logoUrl: string;
    notes: string;
    companyId: string;
    company: CompanyModel | undefined;
}
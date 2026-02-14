import { BaseModel } from "./base.model";
import { User } from "./user.model";

export class Employee extends BaseModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phoneNumber: string;
    profileImageUrl: string | undefined;

    branchOfficeId: string;
    companyId: string;
    userId: string;

    user: User | undefined;
}
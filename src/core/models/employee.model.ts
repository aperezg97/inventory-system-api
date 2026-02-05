import { User } from "./user.model";

export class Employee {
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

    isActive: boolean;

    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}
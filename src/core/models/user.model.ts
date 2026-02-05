import { Role } from "./role.model";

export class User {
    id: string;
    username: string;
    email: string | undefined;
    password: string | undefined;
    roleId: string;
    companyId: string;

    role: Role;

    isActive: boolean;

    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}
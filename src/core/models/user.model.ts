import { BaseModel } from "./base.model";
import { RoleModel } from "./role.model";

export class User extends BaseModel {
    id: string;
    username: string;
    email: string | undefined;
    password: string | undefined;
    roleId: string;
    companyId: string;

    role: RoleModel;
}
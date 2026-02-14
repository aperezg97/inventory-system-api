import { BaseModel } from "./base.model";

export class RoleModel extends BaseModel {
    id: string;
    name: string;
    description: string | undefined;
}
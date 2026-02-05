import { EmployeeDTO } from "./employee-dto.model";

export class AuthUserProfile {
    user: EmployeeDTO;
    // token properties
    iat: string;
    exp: string;
}
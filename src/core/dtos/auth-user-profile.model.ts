import { EmployeeDTO } from "./employee-dto.model";
import { UserDTO } from "./user-dto.model";

export class AuthUserProfile {
    user: UserDTO;
    employee?: EmployeeDTO;
    // token properties
    iat: number;
    exp: number;
}
import { UserDTO } from "./user-dto.model";

export class AuthUserProfile {
    user: UserDTO;
    // token properties
    iat: string;
    exp: string;
}
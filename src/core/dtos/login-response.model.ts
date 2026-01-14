import { UserDTO } from "."

export class LoginResponseDTO {
    access_token: string
    user: UserDTO
}
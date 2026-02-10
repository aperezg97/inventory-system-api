export class JWTModel {
    sub: string; // UserId
    username: string;
    email: string;
    iat: number;
    exp: number;
}
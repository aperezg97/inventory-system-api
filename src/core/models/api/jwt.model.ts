export class JWTModel {
    sub: string; // UserId
    username: string;
    companyId: string;
    iat: number;
    exp: number;
}
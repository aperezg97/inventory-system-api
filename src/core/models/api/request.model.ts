import { User } from "../user.model";

export abstract class RequestModel extends Request {
    companyId: string;
    user: User;
    // token properties
    iat: number;
    exp: number;
}
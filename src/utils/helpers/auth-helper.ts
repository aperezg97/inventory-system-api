import { UnauthorizedException } from "@nestjs/common";
import { RequestModel } from "src/core/models/api";

export class AuthHelper {
    static ValidateLoggedUser(req: RequestModel) {
        if (!req.user?.id) {
            throw new UnauthorizedException();
        }
    }
}
import { BadRequestException } from "@nestjs/common";

export class StringHelper {
    static ValidateUUIDParameter(value: string, msg: string = 'Parameter has no valid UUID format') {
        if (!this.IsValidUUID(value)) {
            throw new BadRequestException(msg);
        }
    }
    static IsValidUUID = (value: string) => {
        return value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    }
}
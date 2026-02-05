import { ApiProperty } from "@nestjs/swagger";
import { UserDTO } from "./user-dto.model";
import { Employee } from "../models";

export class EmployeeDTO {
    @ApiProperty({type: 'string' })
    id: string;
    @ApiProperty({type: 'string' })
    firstName: string;
    @ApiProperty({type: 'string' })
    lastName: string;
    @ApiProperty({type: 'string' })
    email: string;
    @ApiProperty({type: 'string' })
    address: string;
    @ApiProperty({type: 'string' })
    phoneNumber: string;
    @ApiProperty({type: 'string' })
    profileImageUrl: string | undefined;

    @ApiProperty({type: 'string' })
    branchOfficeId: string;
    @ApiProperty({type: 'string' })
    companyId: string;
    @ApiProperty({type: 'string' })
    userId: string;

    @ApiProperty({type: 'object', additionalProperties: true })
    user: UserDTO | undefined;

    @ApiProperty({type: 'boolean'})
    isActive: boolean;

    @ApiProperty({type: 'string', example: new Date() })
    createdAt: Date;
    @ApiProperty({type: 'string' })
    createdBy: string;
    @ApiProperty({type: 'string', example: new Date() })
    updatedAt: Date;
    @ApiProperty({type: 'string' })
    updatedBy: string;

    fromEmployee(data: Employee): EmployeeDTO {
        const result = new EmployeeDTO();
        result.id =  data.id;
        result.firstName =  data.firstName;
        result.lastName =  data.lastName;
        result.email =  data.email;
        result.address =  data.address;
        result.phoneNumber =  data.phoneNumber;
        result.profileImageUrl =  data.profileImageUrl;
        result.branchOfficeId =  data.branchOfficeId;
        result.companyId =  data.companyId;
        result.userId =  data.userId;
        result.user =  data.user ? new UserDTO().fromUser(data.user) : undefined;

        result.isActive =  data.isActive;

        result.createdAt =  data.createdAt;
        result.createdBy =  data.createdBy;
        result.updatedAt =  data.updatedAt;
        result.updatedBy =  data.updatedBy;
        return result;
    }

    toEmployee(data: EmployeeDTO): Employee {
        const result = new Employee();
        result.id =  data.id;
        result.firstName =  data.firstName;
        result.lastName =  data.lastName;
        result.email =  data.email;
        result.address =  data.address;
        result.phoneNumber =  data.phoneNumber;
        result.profileImageUrl =  data.profileImageUrl;
        result.branchOfficeId =  data.branchOfficeId;
        result.companyId =  data.companyId;
        result.userId =  data.userId;
        result.user =  data.user ? new UserDTO().toUser(data.user) : undefined;

        result.isActive =  data.isActive;

        result.createdAt =  data.createdAt;
        result.createdBy =  data.createdBy;
        result.updatedAt =  data.updatedAt;
        result.updatedBy =  data.updatedBy;
        return result;
    }
}
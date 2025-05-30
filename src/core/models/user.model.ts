export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string | undefined;
    isActive: boolean;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
}
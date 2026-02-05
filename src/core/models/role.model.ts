export class Role {
    id: string;
    name: string;
    description: string | undefined;

    isActive: boolean;

    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}
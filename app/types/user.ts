export type Profile = {
    userId: number;
    email: string;
    fullName: string;
    phoneNumber: string;
    status: 'Active' | 'Inactive' | 'Suspended';
    roleId: number;
    roleName: string;
    roleDescription: string;
    avatarUrl?: string;
    phone?: string;
    address?: string;
};


export type APIResponse<T> = {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}


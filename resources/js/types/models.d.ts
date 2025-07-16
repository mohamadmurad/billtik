import { User } from '@/types/index';

export interface PermissionInterface {
    id: number;
    name: string;
    guard_name: string;
}

export interface GroupedPermissionsInterface {
    [key: string]: PermissionInterface[];
}

export interface Abilities {
    view: boolean;
    edit: boolean;
    delete: boolean;

    [Key: string]: boolean;
}

export interface RoleInterface {
    id: number;
    name: string;
    guard_name: string;
    permissions: PermissionInterface[];
    abilities: Abilities;
}

export interface CompanyInterface {
    id: number;
    is_active: string;
    local_name: string;
    created_at: string;
    name: {
        en: string;
        ar: string;
    };
    users: User[];
    abilities: Abilities;
}

export interface PackageInterface {
    id: number;
    price: string;
    price_formatted: string;
    download_input: string;
    upload_input: string;
    upload_kbps: string;
    download_kbps: string;
    local_name: string;
    created_at: string;
    name: {
        en: string;
        ar: string;
    };

    abilities: Abilities;
}

export interface ClientInterface {
    id: number;
    name: string | null;
    username: string;
    password: string;
    email: string | null;
    phone: string | null;
    id_number: string | null;
    created_at: string;

    abilities: Abilities;
}

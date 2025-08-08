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
    abilities: Abilities & {
        need_sync: boolean;
    };
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

export interface RouterInterface {
    id: number;
    company_id: number;
    name: string;
    username: string;
    password: string;
    ip: string;
    port: string;
    created_at: string;
    company: CompanyInterface;
}

export interface ProfileInterface {
    id: number;
    router_id: number;
    company_id: number;
    price: string;
    price_formatted: string;
    download_input: string;
    upload_input: string;
    upload_unit: string;
    upload_formatted: string;
    download_unit: string;
    download_formatted: string;
    local_name: string;
    created_at: string;
    connection_type: string;
    router: RouterInterface;
    name: string;

    abilities: Abilities;
}

export interface ClientInterface {
    id: number;
    name: string | null;
    mikrotik_username: string;
    mikrotik_password: string;
    email: string | null;
    phone: string | null;
    id_number: string | null;
    created_at: string;
    router_id: number;
    router: RouterInterface;
    company_id: number;

    abilities: Abilities;
}

export interface SelectOptionsInterface {
    value: string;
    label: string;
}

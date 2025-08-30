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
    settings: {
        [Key: string]: never;
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

    updated_at: string;
    created_at: string;
    connection_type: string;
    router: RouterInterface;
    name: string;
    is_active: boolean;

    abilities: Abilities & {
        need_sync: boolean;
    };
}

export interface ClientInterface {
    id: number;
    name: string | null;
    mikrotik_username: string;
    status: string;
    status_meta: {
        value: string;
        label: string;
        bgColor: string;
        textColor: string;
    };
    mikrotik_password: string;
    email: string | null;
    phone: string | null;
    id_number: string | null;
    created_at: string;
    router_id: number;
    router: RouterInterface;
    company_id: number;

    subscriptions?: ClientSubscriptionInterface[];
    active_subscription?: ClientSubscriptionInterface | null;

    abilities: Abilities & {
        need_sync: boolean;
    };
}

export interface ClientSubscriptionInterface {
    id: number;
    client: ClientInterface;
    profile: ProfileInterface;
    start_date: string;
    end_date: string | null;
    status: string;
    status_meta: {
        value: string;
        label: string;
        bgColor: string;
        textColor: string;
    };
    abilities: Abilities;
}

export interface SelectOptionsInterface {
    value: string;
    label: string;
}

export interface InvoiceItemInterface {
    id: number;
    item_type: string;
    item_id: number;
    description?: string | null;
    quantity: string; // decimal as string from API
    unit_price: string; // decimal as string from API
    amount: string; // decimal as string from API
    renewal_start?: string | null;
    renewal_end?: string | null;
    item: ClientSubscriptionInterface;
}

export interface InvoiceInterface {
    id: number;
    company_id: number;
    client_id: number;
    number: number;
    formated_number: string;
    status: string;
    issue_date: string;
    due_date: string;
    amount: string; // decimal
    tax_amount: string; // decimal
    discount_amount: string; // decimal
    total_amount: string; // decimal
    description?: string | null;
    paid_at?: string | null;

    client?: ClientInterface;
    items?: InvoiceItemInterface[];
}

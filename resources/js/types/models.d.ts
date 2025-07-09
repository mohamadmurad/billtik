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

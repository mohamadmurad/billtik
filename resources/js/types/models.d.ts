export interface PermissionInterface {
    id: number;
    name: string;
    guard_name: string;

}

export interface GroupedPermissionsInterface {
    [key: string]: PermissionInterface[];

}

export interface RoleInterface {
    id: number;
    name: string;
    guard_name: string;
    permissions: PermissionInterface[];

}

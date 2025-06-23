export interface getRoleBody {
    page: number;
    limit: number;
}

export interface queryRoleBody extends getRoleBody {
    name?: string;
    status?: number;
    create_time?: Array<string>;
    remark?: string;
}

export interface changeRoleStatusBody {
    id: number;
    status: number;
}

export interface addRoleBody {
    name: string;
    remark: string;
}

export interface editRoleBody extends addRoleBody {
    id: number;
}

export interface getRoleMenuBody {
    id: number;
}

export interface updateRoleMenuPermissionBody {
    id: number;
    permission: Array<string>;
}
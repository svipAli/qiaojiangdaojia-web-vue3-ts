export interface QueryMenuModel {
    path?: string;
    name?: string;
    permission?: string;
}

export interface EditMenuModel {
    id: number;
    name: string;
    permission: string;
    order_num: number;
    menu_type: '目录',
    icon: string;
    path: string;
    link_type: string;
    show: boolean;
    status: boolean;
}
/**
 * 用户信息
 *
 * @property userId 编号
 * @property username 用户名
 * @property email 邮箱
 * @property avatar 头像
 * @property nickname 昵称
 * @property remark 备注
 */
export interface User {
    userId: string;
    username: string;
}

export interface queryUserBody {
    page: number;
    limit: number;
    username: string;
    nick_name: string;
    email: string;
    phone: string;
    real_name: string;
    id_number: string;
    sex: number;
    status: number;
    role_id: Array<number>;
    depart_id: Array<number>;
    post_id: Array<number>;
    create_time: Array<string>;
    update_time: Array<string>;
}

export interface switchUserStatusBody {
    id_list: Array<number>;
    status: number;
}

export interface addUserBody {
    username: string;
    password: string;
    password_again: string;
    nick_name: string;
    email: string;
    phone: string;
    role_id: number;
}

export interface editUserBody {
    username: string;
    nick_name: string;
    email: string;
    phone: string;
    role_id: number;
}
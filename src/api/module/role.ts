import Http from '../http';
import {
    getRoleBody,
    queryRoleBody,
    changeRoleStatusBody,
    addRoleBody,
    editRoleBody,
    getRoleMenuBody,
    updateRoleMenuPermissionBody,
} from "@/types/role";

export const apiGetRole = (data: getRoleBody) => {
    return Http.post('/role', data)
}

export const apiQueryRole = (data: queryRoleBody) => {
    return Http.post('/query_role', data)
}

export const apiChangeRoleStatus = (data: changeRoleStatusBody) => {
    return Http.post('/change_role_status', data)
}

export const apiAddRole = (data: addRoleBody) => {
    return Http.post('/add_role', data)
}

export const apiEditRole = (data: editRoleBody) => {
    return Http.post('/edit_role', data)
}

export const apiDelRole = (data: Array<number>) => {
    return Http.post('/del_role', data)
}

export const apiGetRoleMenu = (data: getRoleMenuBody) => {
    return Http.post('/role_menu', data)
}

export const apiUpdateRoleMenu = (data: updateRoleMenuPermissionBody) => {
    return Http.post('/update_role_menu', data)
}
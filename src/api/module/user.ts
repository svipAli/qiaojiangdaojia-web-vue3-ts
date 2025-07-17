import Http from '../http';
import {addUserBody, editUserBody, queryUserBody, switchUserStatusBody} from "@/types/user";

export const login = (loginForm: any) => {
    return Http.post('/login', loginForm)
}

export const menu = () => {
    return Http.get('/menu')
}

export const permission = () => {
    return Http.get('/permission')
}

export const apiQueryUser = (data: queryUserBody) => {
    return Http.post('/query_user', data)
}

export const apiSwitchUserStatus = (data: switchUserStatusBody) => {
    return Http.post('/switch_user_status', data)
}

export const apiAddUser = (data: addUserBody) => {
    return Http.post('/add_user', data)
}

export const apiEditUser = (data: editUserBody) => {
    return Http.post('/edit_user', data)
}

export const apiDeleteUser = (data: Array<number>) => {
    return Http.post('/del_user', data)
}

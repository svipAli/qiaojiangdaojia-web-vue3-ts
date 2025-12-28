import Http from '../http';
import {EditMenuModel, QueryMenuModel} from "@/types/menu";


export const apiGetMenu = (data: QueryMenuModel) => {
    return Http.post('/menus', data)
}

export const apiAddMenu = (data: EditMenuModel) => {
    return Http.post('/add_menu', data)
}

export const apiEditMenu = (data: EditMenuModel) => {
    return Http.post('/edit_menu', data)
}

export const apiDelMenu = (data: {id: number}) => {
    return Http.post('/del_menu', data)
}

export const apiEditMenuStatus = (data: {id: number, status: boolean}) => {
    return Http.post('/edit_menu_status', data)
}

export const apiEditMenuVisible = (data: {id: number, show: boolean}) => {
    return Http.post('/edit_menu_visible', data)
}
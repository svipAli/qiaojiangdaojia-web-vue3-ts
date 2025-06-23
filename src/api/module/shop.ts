import Http from '../http';
import {addShopBody, editShopBody, getShopQueryBody, updateShopQueryBody} from "@/types/shop";

export const apiAddShop = (data: addShopBody) => {
    return Http.post('/add_shop', data)
}

export const apiEditAddShop = (data: editShopBody) => {
    return Http.post('/edit_shop', data)
}

export const apiQueryShop = (data: getShopQueryBody) => {
    return Http.post('/query_shop', data)
}
export const apiChangeShopStatus = (data: updateShopQueryBody) => {
    return Http.post('/change_shop_status', data)
}

export const apiDelShop = (data: Array<number>) => {
    return Http.post('/del_shop', data)
}
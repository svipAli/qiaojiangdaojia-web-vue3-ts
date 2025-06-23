import Http from "@/api/http";
import {
    getProductPartBody,
    getBackQueryBody,
    saveProductPartBody,
    setProductPartStatusBody, setProductTrayBody, setProductPartCountBody
} from "@/types/warehouse-return";

export const apiQueryBack = (data: getBackQueryBody) => {
    return Http.post('/query_return', data)
}

export const apiQueryProductPart = (data: getProductPartBody) => {
    return Http.get('/query_product_part', data)
}

export const apiSaveProductPart = (data:saveProductPartBody) => {
    return Http.post('/save_product_part', data)
}

export const apiGetProductPart = (data:getProductPartBody) => {
    return Http.get('/get_product_part', data)
}

export const apiDelProductPart = (data:saveProductPartBody) => {
    return Http.post('/del_product_part', data)
}

export const apiSetProductPartStatus = (data:setProductPartStatusBody) => {
    return Http.post('/set_product_part_repair_status', data)
}

export const apiSetProductTray = (data:setProductTrayBody) => {
    return Http.post('/set_product_tray', data)
}

export const apiSetProductPartCount = (data:setProductPartCountBody) => {
    return Http.post('/set_product_part_count', data)
}

export const apiBackProductPutInWarehouseNoConfirm = (data:Array<number>) => {
    return Http.post('/back_product_put_in_warehouse_no_confirm', data)
}


export const apiBackProductPutInWarehouseNoCancel = (data:Array<number>) => {
    return Http.post('/back_product_put_in_warehouse_no_cancel', data)
}
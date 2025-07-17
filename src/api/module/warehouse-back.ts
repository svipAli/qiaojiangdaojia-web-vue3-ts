import Http from '../http';
import {
    addBackRecordBody, batchOptionSetBody, checkOrderBody, editBackRecordBody,
    getBackProductBody,
    getBackQueryBody, getVideoUrlBody,
    saveAddBackProductBody, setBackProductWarehouseNoBody,
    switchAddBackProductStatusBody, switchBackRecordStatusBody, updateVideoUrlBody
} from "@/types/warehouse-back";


export const apiBackQuery = (data: getBackQueryBody) => {
    return Http.post('/query_back', data)
}

export const apiAddBackRecord = (data: addBackRecordBody) => {
    return Http.post('/add_back', data)
}

export const apiEditBackRecord = (data: editBackRecordBody) => {
    return Http.post('/edit_back', data)
}

export const apiDelBackRecord = (data: Array<number>) => {
    return Http.post('/del_back', data)
}

export const apiSwitchBackRecordStatusBody = (data: switchBackRecordStatusBody) => {
    return Http.post('/switch_back_status', data)
}

export const apiShopList = () => {
    return Http.get('/shop_list')
}

export const apiGetBackProduct = (params: getBackProductBody) => {
    return Http.get('/get_back_product', params)
}

export const apiSaveAddBackProduct = (data: saveAddBackProductBody) => {
    return Http.post('/add_back_product', data)
}

export const apiSwitchBackProductStatus = (data: Array<switchAddBackProductStatusBody>) => {
    return Http.post('/switch_back_product_status', data)
}

export const apiSetBackProductWarehouseNo = (data: setBackProductWarehouseNoBody) => {
    return Http.post('/set_back_product_warehouse_no', data)
}

export const apiDelBackProduct = (data: Array<number>) => {
    return Http.post('/del_back_product', data)
}

export const apiGetVideoUrl = (data: getVideoUrlBody) => {
    return Http.get('/get_video_url', data)
}

export const apiDelVideoUrl = (data: getVideoUrlBody) => {
    return Http.post('/del_video_url', data)
}

export const apiUpdateVideoUrl = (data: updateVideoUrlBody) => {
    return Http.post('/update_video_url', data)
}

export const apiBatchOptionSet = (data: batchOptionSetBody) => {
    return Http.post('/batch_option_set', data)
}

export const apiCheckOrder = (data: checkOrderBody) => {
    return Http.get('/check_order', data)
}
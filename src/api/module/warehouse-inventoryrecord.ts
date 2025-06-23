import Http from '../http';
import {
    addInventoryRecordBody, delInventoryPartBody, delInventoryRecordBody,
    getInventoryRecordBody,
    getInventoryRecordDetailBody, passTheAuditBody, setInventoryPartCountBody
} from "@/types/warehouse-inventoryrecord";


export const apiInventoryRecordQuery = (data: getInventoryRecordBody) => {
    return Http.post('/query_inventory_record', data)
}

export const apiAddInventoryRecord = (data: addInventoryRecordBody) => {
    return Http.post('/add_inventory_record', data)
}

export const apiGetInventoryRecordDetail = (data: getInventoryRecordDetailBody) => {
    return Http.post('/get_inventory_record_detail', data)
}

export const apiSetInventoryPartCount = (data: setInventoryPartCountBody) => {
    return Http.post('/set_inventory_part_count', data)
}

export const apiDelInventoryPartDetail = (data: delInventoryPartBody) => {
    return Http.post('/del_inventory_part_detail', data)
}

export const apiPassTheAudit = (data: passTheAuditBody) => {
    return Http.post('/pass_the_audit', data)
}


export const apiDelInventoryRecord = (data: delInventoryRecordBody) => {
    return Http.post('/del_inventory_record', data)
}
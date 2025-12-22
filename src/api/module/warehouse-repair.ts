import Http from "@/api/http";
import {
    setBackProductRepairWarehouseNoBody,
    setProductPartUseCountBody,
    setProductRepairTypeBody
} from "@/types/warehouse-repair";

export const apiSetProductPartUseCount = (data: setProductPartUseCountBody) => {
    return Http.post('/set_product_part_use_count', data)
}

export const apiSetProductRepairType = (data:setProductRepairTypeBody) => {
    return Http.post('/set_product_repair_type', data)
}

export const apiSetRepairPutInWarehouseNo = (data:setBackProductRepairWarehouseNoBody) => {
    return Http.post('/set_repair_put_in_warehouse_no', data)
}
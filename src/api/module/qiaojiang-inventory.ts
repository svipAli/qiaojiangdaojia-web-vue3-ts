import Http from '../http';
import {getInventoryPartBody} from "@/types/warehouse-inventory";


export const apiGetInventoryPart = async (body: getInventoryPartBody) => {
    return await Http.post('/get_inventory_part', body);
}
export const apiExportInventory = async () => {
    return await Http.post('/export_inventory');
}
import Http from '../http';
import {addTrayBody, exportTrayPartBody, getTrayQueryBody, updateTrayConfigBody} from "@/types/warehouse-tray";

export const apiAddTray = (data: addTrayBody) => {
    return Http.post('/add_tray', data)
}

export const apiQueryTray = (data: getTrayQueryBody) => {
    return Http.post('/query_tray', data)
}

export const apiDelTray = (data: Array<number>) => {
    return Http.post('/del_tray', data)
}

export const apiUpdateTrayConfig = (data: updateTrayConfigBody) => {
    return Http.post('/update_tray_config', data)
}

export const apiExportTrayPart = (data: exportTrayPartBody) => {
    return Http.get('/export_tray_part', data)
}
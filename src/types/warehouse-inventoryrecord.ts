export interface getInventoryRecordBody {
    record_no: string;
    type: number;
    status: number;
    create_time: Array<string>;
    update_time: Array<string>;
    page: number;
    limit: number;
}

export interface addInventoryRecordBody {
    type: number;
}

export interface getInventoryRecordDetailBody {
    id: string;
}

export interface setInventoryPartCountBody {
    part_id: number;
    count: number;
}

export interface delInventoryPartBody {
    id: number;
    part_list: Array<number>;
}

export interface passTheAuditBody {
    id: number;
}

export interface delInventoryRecordBody {
    id_list: Array<number>;
}


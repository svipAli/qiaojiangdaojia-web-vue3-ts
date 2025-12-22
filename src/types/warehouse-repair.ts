export interface setProductPartUseCountBody {
    part_id: number;
    use_count: number;
}

export interface setProductRepairTypeBody {
    id_list: Array<number>;
    repair_type: number;
    repair_put_in_warehouse_name: number;
}


export interface setBackProductRepairWarehouseNoBody {
    id_list: Array<number>;
    repair_put_in_warehouse_no: string;
}
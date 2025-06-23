export interface setProductPartUseCountBody {
    part_id: number;
    use_count: number;
}

export interface setProductRepairTypeBody {
    id_list: Array<number>;
    repair_type: number;
}
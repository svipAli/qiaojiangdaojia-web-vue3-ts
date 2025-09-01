export interface getBackQueryBody {
    br_id: string;
    order_no: string;
    product_code: string;
    logistics_no: string;
    tray_no: string;
    put_in_warehouse_no: string;
    product_model: string;
    shop_id: Array<number>;
    class_id: Array<number>;
    confirm_time: Array<string>;
    put_in_warehouse_time: Array<string>;
    create_time: Array<string>;
    update_time: Array<string>;
    repair_status: number;
    repair_type: number;
    quality_type: number;
    status: number;
    warehouse_name: number;
    is_back_to_factory: number;
    page: number;
    limit: number;
}

export interface getProductPartBody {
    product_model: string;
}

export interface getProductPartIdBody {
    id: number;
}

export interface saveProductPartBody {
    id: number;
    part_list: Array<number>;
}

export interface setProductPartStatusBody {
    id_list: Array<number>;
    repair_status: number;
}

export interface setProductTrayBody {
    id_list: Array<number>;
    tray_no: string;
}

export interface setProductPartCountBody {
    part_id: number;
    count: number;
}

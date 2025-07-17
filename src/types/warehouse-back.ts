export interface getBackQueryBody {
    page: number;
    limit: number;
    br_id: string;
    order_no: string;
    shop_id: number;
    status: number;
    logistics_no: string;
    create_time: Array<string>;
    update_time: Array<string>;
}

export interface getBackProductBody {
    br_id: string;
}

export interface saveAddBackProductBody {
    br_id: string;
    product_list: Array<number>;
    count?: number;
}

export interface switchAddBackProductStatusBody {
    id: number;
    status: number;
    quality_type: number;
    warehouse_name: number;
}

export interface setBackProductWarehouseNoBody {
    id_list: Array<number>;
    put_in_warehouse_no: string;
}

export interface addBackRecordBody {
    shop_id: number;
    order_no: string;
    refund_no: string;
    taobao_name: string;
    logistics_name: string;
    logistics_no: string;
    kf_remark: string;
    back_reason: string;
}

export interface editBackRecordBody extends addBackRecordBody {
    br_id: string;
}

export interface switchBackRecordStatusBody {
    br_id: string;
    status: number;
}

export interface getVideoUrlBody {
    br_id: string;
}

export interface updateVideoUrlBody {
    br_id: string;
    video_url: string;
}

export interface batchOptionSetBody {
    product_list: Array<number>;
    quality_type: number;
    warehouse_name: number;
}

export interface checkOrderBody {
    order_no: string;
}
export interface getPageBody {
    page: number;
    limit: number;
}

export interface queryClassBody extends getPageBody {
    name?: string;
    status?: number;
    create_time?: Array<string>;
    remark?: string;
}

export interface changeClassStatusBody {
    id: number;
    status: number;
}

export interface addClassBody {
    name: string;
    code_str: string;
    parent_id: number;
    remark: string;
}

export interface editClassBody {
    id: number;
    name: string;
    code_str: string;
    remark: string;
}

export interface queryProductBody extends getPageBody {
    product_model?: string;
    product_name?: string;
    class_id?: number;
    create_time?: Array<string>;
    status?: number;
}

export interface changeProductStatusBody {
    id: number;
    status: number;
}

export interface addProductBody {
    product_model: string;
    product_name: string;
    class_id: number;
    remark: string;
}

export interface editProductBody {
    id: number;
    product_name: string;
    remark: string;
    parent_class_id: number;
}

// 零件
export interface queryPartBody extends getPageBody {
    product_model?: string;
    part_name?: string;
    part_model?: string;
    class_id?: number;
    remark?: string;
    create_time?: Array<string>;
    status?: number;
}

export interface changePartStatusBody {
    id: number;
    status: number;
}

export interface addPartBody {
    part_class_id: number;
    product_id: Array<number>;
    part_model: string;
    part_name: string;
    purchase_price: number;
    sale_price: number;
    remark: string;
}

export interface editPartBody {
    id: number;
    part_name: string;
    remark: string;
    purchase_price: number;
    sale_price: number;
}
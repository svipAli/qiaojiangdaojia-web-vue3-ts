export interface addQJInvoiceBody {
    invoice_title: string;
    tax_no: string;
    address: string;
    phone: string;
    bank_name: string;
    bank_account: string;
    invoice_content: string;
    invoice_remark: string;
    receive_email: string;
    invoice_amount: number;
    invoice_type: number;
    tax_point: number;
}

export interface queryQJInvoiceBody {
    page: number;
    limit: number;
    invoice_title: string;
    tax_no: string;
    invoice_type: number;
    status: number;
    create_time: Array<string>;
    update_time: Array<string>;
}

export interface editQJInvoiceBody extends addQJInvoiceBody {
    id: number
}

export interface redQJInvoiceBody {
    id: number;
}

export interface delQJInvoiceBody {
    id_list: Array<number>;
}
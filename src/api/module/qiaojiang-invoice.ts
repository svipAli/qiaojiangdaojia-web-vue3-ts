import Http from '../http';
import {
    addQJInvoiceBody,
    delQJInvoiceBody,
    editQJInvoiceBody,
    queryQJInvoiceBody,
    redQJInvoiceBody
} from "@/types/qiaojiang-invoice";


export const apiAddQJInvoice = (data: addQJInvoiceBody) => {
    return Http.post('/qj_add_invoice', data)
}

export const apiQueryQJInvoice = (data: queryQJInvoiceBody) => {
    return Http.post('/qj_query_invoice', data)
}

export const apiEditQJInvoice = (data: editQJInvoiceBody) => {
    return Http.post('/qj_edit_invoice', data)
}

export const apiRedQJInvoice = (data: redQJInvoiceBody) => {
    return Http.post('/set_red_invoice', data)
}

export const apiDelQJInvoice = (data: delQJInvoiceBody) => {
    return Http.post('/qj_del_invoice', data)
}

export const apiDingDingPushQJInvoice = (data: delQJInvoiceBody) => {
    return Http.post('/qj_dingding_push_invoice', data)
}
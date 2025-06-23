import Http from '../http';

import {
    getPageBody,
    queryProductBody,
    changeProductStatusBody,
    addProductBody,
    editProductBody,
    queryClassBody,
    changeClassStatusBody,
    addClassBody,
    editClassBody, queryPartBody, changePartStatusBody, addPartBody, editPartBody,
} from "@/types/product";

export const apiGetClass = (data: getPageBody) => {
    return Http.post('/classes', data)
}
export const apiGetAllClass = () => {
    return Http.get('/all_class')
}

export const apiQueryClass = (data: queryClassBody) => {
    return Http.post('/query_class', data)
}

export const apiChangeClassStatus = (data: changeClassStatusBody) => {
    return Http.post('/change_class_status', data)
}

export const apiAddClass = (data: addClassBody) => {
    return Http.post('/add_class', data)
}

export const apiEditClass = (data: editClassBody) => {
    return Http.post('/edit_class', data)
}

export const apiDelClass = (data: Array<number>) => {
    return Http.post('/del_class', data)
}


export const apiGetProduct = (data: getPageBody) => {
    return Http.post('/product', data)
}

export const apiGetAllClasses = () => {
    return Http.get('/all_classes')
}

export const apiQueryProduct = (data: queryProductBody) => {
    return Http.post('/query_product', data)
}

export const apiChangeProductStatus = (data: changeProductStatusBody) => {
    return Http.post('/change_product_status', data)
}

export const apiAddProduct = (data: addProductBody) => {
    return Http.post('/add_product', data)
}

export const apiEditProduct = (data: editProductBody) => {
    return Http.post('/edit_product', data)
}

export const apiDelProduct = (data: Array<number>) => {
    return Http.post('/del_product', data)
}

// Compare this snippet from product.ts:

export const apiGetPart = (data: getPageBody) => {
    return Http.post('/part', data)
}

export const apiQueryPart = (data: queryPartBody) => {
    return Http.post('/query_part', data)
}

export const apiChangePartStatus = (data: changePartStatusBody) => {
    return Http.post('/change_part_status', data)
}

export const apiAddPart = (data: addPartBody) => {
    return Http.post('/add_part', data)
}

export const apiEditPart = (data: editPartBody) => {
    return Http.post('/edit_part', data)
}

export const apiDelPart = (data: Array<number>) => {
    return Http.post('/del_part', data)
}
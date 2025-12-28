import Http from '../../http';

const BasePath = '/qj'

export const apiGetPhoneVerifyCode = (data: { phone: string }) => {
    return Http.post(`${BasePath}/plus/verify/phone_code`, data)
}

export const apiVerifyCodeLogin = (data: { phone: string, code: string }) => {
    return Http.post(`${BasePath}/plus/verify/login`, data)
}

export const apiRefreshAW = (data: { status: number, token: string }) => {
    return Http.post(`${BasePath}/plus/get/aw`, data)
}

export const apiAWLocation = (data: { location: string, incidents_id: string, token: string }) => {
    return Http.post(`${BasePath}/plus/aw/location`, data)
}

export const apiAWGetNode = (data: { incidents_id: string, token: string }) => {
    return Http.post(`${BasePath}/plus/aw/node`, data)
}

export const apiAWSaveImage = (data: {
    incidents_id: string,
    incidentsWorkstageId: number,
    img_url: string,
    token: string
}) => {
    return Http.post(`${BasePath}/plus/aw/save_img`, data)
}


export const apiAWSetBarCode = (data: { incidents_id: string, barcode: string, token: string }) => {
    return Http.post(`${BasePath}/plus/aw/set_barcode`, data)
}

export const apiAWSetAWDown = (data: { incidents_id: string, token: string }) => {
    return Http.post(`${BasePath}/plus/aw/set_aw_down`, data)
}
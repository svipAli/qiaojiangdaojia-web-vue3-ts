import axios, {AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {useUserStore} from "@/store/user";
import {layer} from '@layui/layui-vue';
import router from '../router'

type TAxiosOption = {
    timeout: number;
    baseURL: string;
}

export const config: TAxiosOption = {
    timeout: 30000,
    // baseURL: "https://api.qj.xienkeji.com",
    baseURL: "https://api.qiaojiangdaojia.top",
    // baseURL: "http://127.0.0.1:8000",
}

class Http {
    service;

    constructor(config: TAxiosOption) {
        this.service = axios.create(config)

        /* 请求拦截 */
        this.service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            const userInfoStore = useUserStore();
            if (userInfoStore.token) {
                (config.headers as AxiosRequestHeaders).Authorization = userInfoStore.token as string
            } else {
                if (router.currentRoute.value.path !== '/login') {
                    router.push('/login');
                }
            }
            return config
        }, error => {
            return Promise.reject(error);
        })

        /* 响应拦截 */
        this.service.interceptors.response.use((response: AxiosResponse<any>) => {
            switch (response.status) {
                case 200:
                    return response.data;
                case 401:
                    layer.confirm(
                        '会话超时, 请重新登录',
                        {
                            icon: 2, yes: function () {
                                router.push('/login');
                                layer.closeAll()
                            }
                        });
                    return response.data;
                default:
                    break;
            }
        }, error => {
            console.log(error)
            if (!error.response) {
                layer.msg('请求失败！', {icon: 2, time: 3000})
                return Promise.reject(error);
            }
            if (error.response.status === 401) {
                layer.msg('身份验证失败，请重新登录！', {icon: 2, time: 3000})
                return Promise.reject(error);
            } else if (error.response.status === 403) {
                let detail = error.response.data.detail;
                if (typeof detail === 'object') {
                    detail = JSON.stringify(detail);
                }
                layer.msg(detail, {icon: 2, time: 3000})
                return Promise.reject(error);
            } else if (error.response.status === 500) {
                layer.msg('服务器错误', {icon: 2, time: 3000})
                return Promise.reject(error);
            } else {
                layer.msg(error.message, {icon: 2, time: 3000})
                return Promise.reject(error);
            }
        })
    }

    /* GET 方法 */
    get<T>(url: string, params?: object, _object = {}): Promise<any> {
        return this.service.get(url, {params, ..._object})
    }

    /* POST 方法 */
    post<T>(url: string, params?: object, _object = {}): Promise<any> {
        return this.service.post(url, params, _object)
    }

    /* PUT 方法 */
    put<T>(url: string, params?: object, _object = {}): Promise<any> {
        return this.service.put(url, params, _object)
    }

    /* DELETE 方法 */
    delete<T>(url: string, params?: any, _object = {}): Promise<any> {
        return this.service.delete(url, {params, ..._object})
    }
}

export default new Http(config)
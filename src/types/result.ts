/**
 * 结果集
 *
 * @property code 状态码
 * @property message 提示信息
 * @property data 携带数据
 * @property total 数据总量
 */
export interface Result {
    code: number;
    message: string;
    data?: any;
    total?: number;
}
export const convertTime = (timestamp: number) => {
    if (timestamp === null || timestamp === undefined || timestamp.toString().length !== 13) {
        return '';
    }
    const date = new Date(timestamp);
    // 提取时间信息（本地时区）
    const year = date.getFullYear();     // 2023
    const month = date.getMonth() + 1;   // 10（注意月份从0开始，需+1）
    const day = date.getDate();          // 1
    const hours = date.getHours();       // 8（假设时区为UTC+8）
    const minutes = date.getMinutes();   // 0
    const seconds = date.getSeconds();   // 0
    // 格式化输出
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export const getCurrentDay = () => {
    const date = new Date();
    // 提取时间信息（本地时区）
    const year = date.getFullYear();     // 2023
    const month = date.getMonth() + 1;   // 10（注意月份从0开始，需+1）
    const day = date.getDate();          // 1
    // 格式化输出
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

export const getWarehouseName = (warehouse_name: number) => {
    switch (warehouse_name) {
        case 0:
            return "待定";
        case 1:
            return "正品仓";
        case 2:
            return "次品仓";
        case 3:
            return "报废仓";
        case 4:
            return "次转正仓";
        case 5:
            return "专送仓";
        default:
            return "未知";
    }
}


export const getQualityType = (quality_type: number) => {
    switch (quality_type) {
        case 0:
            return "待定";
        case 1:
            return "正品";
        case 2:
            return "次品";
        case 3:
            return "二手销售";
        case 4:
            return "报废";
        default:
            return "未知";
    }
}

export const getRepairStatus = (repair_status: number) => {
    switch (repair_status) {
        case 0:
            return "待检测";
        case 1:
            return "已检测";
        case 2:
            return "待维修";
        case 3:
            return "已维修";
        default:
            return "未知";
    }
}

export const getStatus = (status: number) => {
    switch (status) {
        case 0:
            return "待确认";
        case 1:
            return "已确认";
        case 2:
            return "已入库";
        default:
            return "未知";
    }
}

export const getProductPartStatus = (status: number) => {
    switch (status) {
        case 0:
            return "未使用";
        case 1:
            return "已使用";
        default:
            return "未知";
    }
}
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
export {};
declare global {
    interface Result {
        code: number;
        message: string;
        data?: any;
    }

    interface DataResult {
        code: number;
        message: string;
        data: any;
        total: number;
    }
}
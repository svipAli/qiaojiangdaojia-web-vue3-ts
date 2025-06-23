export interface addShopBody {
    name: string;
    code_str: string;
}

export interface getShopQueryBody extends addShopBody {
    status: number;
}

export interface updateShopQueryBody {
    id: number;
    status: number;
}

export interface editShopBody extends addShopBody {
    id: number;
}
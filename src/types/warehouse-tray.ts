export interface addTrayBody {
    tray_no: string;
    remark: string;
}

export interface editTrayBody {
    id: number;
    remark: string;
}

export interface getTrayQueryBody extends addTrayBody {
    status: number;
}

export interface updateTrayConfigBody {
    id: number;
    predict_complete_time: string;
    purchase_time: string;
    arrived_time: string;
}

export interface exportTrayPartBody {
    id: number;
}
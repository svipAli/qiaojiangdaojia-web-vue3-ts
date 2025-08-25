import Http from '../http';

export const getWorkspaceWorkbench = () => {
    return Http.post('/workspace_workbench');
}
export const getClassMonthData = () => {
    return Http.post('/class_month_data');
}

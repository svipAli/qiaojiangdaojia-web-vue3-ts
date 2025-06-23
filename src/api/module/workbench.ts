import Http from '../http';

export const getWorkbench = () => {
    return Http.post('/workbench');
}

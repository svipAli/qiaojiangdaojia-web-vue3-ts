import Http from '../http';

export const apiGetAwData = () => {
    return Http.get('/aw_data');
}
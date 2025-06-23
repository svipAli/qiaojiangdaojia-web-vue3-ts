import Http from '../http';

export const login = (loginForm: any) => {
    return Http.post('/login', loginForm)
}

export const menu = () => {
    return Http.get('/menu')
}

export const permission = () => {
    return Http.get('/permission')
}
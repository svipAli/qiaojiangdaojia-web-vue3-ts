import Http from '../http';

//登录验证码
export const verificationImg = () => {
    return Http.get('/code_img')
}
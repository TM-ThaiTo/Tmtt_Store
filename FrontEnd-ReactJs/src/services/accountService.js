import axios from '../axios';

const endpoint = "/api/v1/account";

// gửi mã đăng ký tài khoản
const postSendVerifyCode = (data) => {
    return axios.post(endpoint + "/sendmail", data);
};

// fn: api xác nhận đăng kí
const postSignUp = (account) => {
    return axios.post(endpoint + "/signup", account);
}

// fn: api đổi mật khẩu
const postResetPassword = (account) => {
    return axios.post(endpoint + "/forgot", account);
}

export {
    postSendVerifyCode,
    postSignUp,
    postResetPassword
}
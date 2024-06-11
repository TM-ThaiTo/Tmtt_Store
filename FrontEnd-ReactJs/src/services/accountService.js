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

// fn: api gửi mã quên mật khẩu
const postSendCodeForgotPW = (email) => {
    const data = {
        mail: email,
        title: 1
    }
    return axios.post(endpoint + "/forgot", email);
}

// fn: api đổi mật khẩu
const postResetPassword = (account) => {
    return axios.post(endpoint + "/forgot", account);
}

export {
    postSendVerifyCode,
    postSignUp,
    postSendCodeForgotPW,
    postResetPassword
}
import axios from '../axios';
import constants from '../constants';

const endpoint = "/api/v1/account";

// POST:  API login bang tai khoan thong thuong
const post_loginuser = (account) => {
    return axios.post(endpoint + "/login", account);
};

const getAuth = () => {
    const authToken = localStorage.getItem(constants.ACCESS_TOKEN_KEY);
    return axios.get(endpoint + "/auth", {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    })
};

// POST: SignUp bằng Google
const postLoginWithGoogle = (data) => {
    return axios.post('/apis/gg', data);
}

// GET: Refresh Token
const getRefreshToken = (refresh_token) => {
    return axios.get(endpoint + "/refresh_token", {
        headers: {
            Authorization: `Bearer ${refresh_token}`
        }
    });
}

// POST: Logout
const postLogout = () => {
    const token = localStorage.getItem(constants.REFRESH_TOKEN_KEY);
    return axios.post(`${endpoint}/logout`, token)
}

export {
    post_loginuser,
    getAuth,
    getRefreshToken,
    postLogout,
    postLoginWithGoogle
}
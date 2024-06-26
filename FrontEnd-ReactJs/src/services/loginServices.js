import axios from '../axios';
import constants from '../constants';

const endpoint = "/api/v1/account";
const authToken = localStorage.getItem(constants.REFRESH_TOKEN);

// POST:  API login bang tai khoan thong thuong
const post_loginuser = (account) => {
    return axios.post(endpoint + "/login", account);
};

const getAuth = () => {
    return axios.get(endpoint + "/auth", {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    })
};

// POST: SignUp bằng Google
const postLoginWithGoogle = (data) => {
    return axios.post(endpoint + '/gg', data);
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
    return axios.post(`${endpoint}/logout`, authToken)
}

export {
    post_loginuser,
    getAuth,
    getRefreshToken,
    postLogout,
    postLoginWithGoogle
}
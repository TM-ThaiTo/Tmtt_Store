import axios from '../axios';
import constants from '../constants';

const endpoint = "/api/v1/account";

// POST:  API login bang tai khoan thong thuong
const post_loginuser = (account) => {
    return axios.post(endpoint + "/login", account);
};

// GET: auth
const getAuth = () => {
    const authToken = localStorage.getItem(constants.REFRESH_TOKEN_KEY);
    return axios.get("/apis/auth", {
        params: {
            token: authToken,
        }
    })
}

// POST: SignUp bằng Google
const postLoginWithGoogle = (data) => {
    return axios.post('/apis/gg', data);
}

// POST: Refresh Token
const postRefreshToken = (refreshToken) => {
    return axios.post("/apis/refresh_token", refreshToken);
}

// POST: Logout
const postLogout = () => {
    const token = localStorage.getItem(constants.REFRESH_TOKEN_KEY);
    return axios.post("/apis/logout", { refreshToken: token });
}

export {
    post_loginuser,
    getAuth,
    postRefreshToken,
    postLogout,
    postLoginWithGoogle
}
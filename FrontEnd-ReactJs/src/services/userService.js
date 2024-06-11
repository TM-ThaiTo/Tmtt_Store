import axios from '../axios';
import constants from '../constants';

// GET user
const getUserApi = () => {
    const token = localStorage.getItem(constants.REFRESH_TOKEN_KEY);
    return axios.get('/apis/user', {
        params: {
            RefreshToken: token
        }
    });
}

// api: PUT update user
const postUpdateUser = (data) => {
    return axios.post('/apis/user/update', {
        Id_account: data.Id_account,
        email: data.email,
        fullName: data.fullName,
        birthDay: data.birthDay,
        gender: data.gender,
        address: data.address,
    })
}

export {
    getUserApi,
    postUpdateUser
}
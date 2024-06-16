import axios from '../axios';
import constants from '../constants';

const endpoint = "/api/v1/user"

// GET user
const getUserApi = () => {
    const token = localStorage.getItem(constants.ACCESS_TOKEN_KEY);
    return axios.get(endpoint, {
        headers: {
            Authorization: `Bearer ${token}`
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
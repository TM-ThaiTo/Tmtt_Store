import axios from '../axios';
import constants from '../constants';

const endpoint = "/api/v1/user"
const token = localStorage.getItem(constants.REFRESH_TOKEN);

// GET user
const getUserApi = () => {
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
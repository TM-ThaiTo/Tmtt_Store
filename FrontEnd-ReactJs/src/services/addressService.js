import axios from '../axios';
import constants from '../constants';

const endpoint = "/api/v1/address";

// fn: get list address 
const getDeliveryAddress = (userId) => {
    const authToken = localStorage.getItem(constants.ACCESS_TOKEN_KEY);
    return axios.get(endpoint + "/delivery", {
        headers: {
            Authorization: `Bearer ${authToken}`
        },
        params: {
            accountId: userId
        }
    });
};


// api: Thêm một địa chỉ mới
const postNewDeliveryAddress = (data) => {
    const authToken = localStorage.getItem(constants.ACCESS_TOKEN_KEY);
    return axios.post(endpoint + "/delivery/add", data, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

// api: Delete địa chỉ
const delDeliveryAddress = (idUser, idAddress) => {
    const authToken = localStorage.getItem(constants.ACCESS_TOKEN_KEY);
    return axios.delete(endpoint + "/delivery", {
        headers: {
            Authorization: `Bearer ${authToken}`
        },
        params: {
            idAccount: idUser,
            idAddress: idAddress
        }
    })
}

// api: PUT cài đặt địa chỉ làm mặc định
const putSetDefaultAdress = (id, idA) => {
    const authToken = localStorage.getItem(constants.ACCESS_TOKEN_KEY);
    return axios.put(endpoint + "/delivery", null, {
        headers: {
            Authorization: `Bearer ${authToken}`
        },
        params: {
            idAccount: id,
            idAddress: idA
        }
    });
}


// api: lấy Danh sách tỉnh
const getProvince = () => {
    return axios.get(endpoint + "/provinces");
}

// api: lấy Danh sách huyện theo id tỉnh
const getDistrict = (id) => {
    return axios.get(endpoint + '/districts', {
        params: {
            provinceId: id
        },
    });
}

// api: lấy danh sách phường theo id huyện
const getCommune = (id) => {
    return axios.get(endpoint + "/communes", {
        params: {
            districtId: id
        },
    });
}

export {
    getDeliveryAddress,
    postNewDeliveryAddress,
    delDeliveryAddress,
    putSetDefaultAdress,
    getProvince,
    getDistrict,
    getCommune
};

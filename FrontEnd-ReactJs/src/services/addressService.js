import axios from '../axios';

// fn: get list address 
const getDeliveryAddress = (userId) => {
    return axios.get("/apis/address/delivery", {
        params: {
            IdUser: userId
        }
    });
};

// api: Thêm một địa chỉ mới
const postNewDeliveryAddress = (data) => {
    return axios.post("/apis/address/delivery", data);
}

// api: Delete địa chỉ
const delDeliveryAddress = (idUser, idAddress) => {
    return axios.delete("/apis/address/delivery", {
        params: {
            idUser: idUser,
            idAdress: idAddress
        }
    })
}

// api: PUT cài đặt địa chỉ làm mặc định
const putSetDefaultAdress = (data) => {
    return axios.put("/apis/address/delivery", data);
}

// api: lấy Danh sách tỉnh
const getProvince = () => {
    return axios.get(`/apis/address/province`);
}

// api: lấy Danh sách huyện theo id tỉnh
const getDistrict = (id) => {
    return axios.get(`/apis/address/district`, {
        params: {
            idProvince: id
        },
    });
}

// api: lấy danh sách phường theo id huyện
const getCommune = (id) => {
    return axios.get(`/apis/address/commune`, {
        params: {
            idDistrict: id
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

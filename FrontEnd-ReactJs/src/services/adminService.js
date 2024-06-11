import axios from '../axios';

// api: login admin
const postLoginAdmin = (account) => {
    return axios.post("/apis/admin/login-admin", account);
};

// api: get lấy danh sách product
const getStatus = () => {
    return axios.get("/apis/products/all");
};

// api: POST thêm sản phẩm
const postAddProduct = (product) => {
    return axios.post("/apis/admin/products/add", product);
}

// api: PUT update sản phẩm
const putUpdateProductApi = (data) => {
    return axios.put('/apis/admin/products/update', data);
}

// api: DELETE sản phẩm
const deleteProductApi = (id) => {
    return axios.delete('/apis/admin/products/delete', {
        params: {
            id: id
        }
    });
}

// api: get lấy danh sách admin
const getAllAdmin = () => {
    return axios.get("/apis/admin/get-admin", { params: { id: -1 } });
}

// api: get lấy danh sách user
const getUserApi = () => {
    return axios.get("/apis/admin/get-user", { params: { id: -1 } });
}

// api: DELETE xoá người dung
const delCustomerApi = (idUser) => {
    return axios.delete("/apis/admin/deluser", { params: { idUser: idUser } })
}

// api: GET lấy list order
const getOrderListApi = () => {
    return axios.get("/apis/admin/orders",);
}

// api: POST update status
const postUpdateStatusOrderApi = (data) => {
    return axios.post("/apis/admin/orders", data);
}

export {
    getAllAdmin,
    getUserApi,
    postAddProduct,
    postLoginAdmin,
    getStatus,
    getOrderListApi,
    postUpdateStatusOrderApi,
    delCustomerApi,
    putUpdateProductApi,
    deleteProductApi
}
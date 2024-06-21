import axios from '../axios';
import constants from '../constants';

const endpoint = "/api/v1/admin"
const token = localStorage.getItem(constants.REFRESH_TOKEN_KEY);

// api: get lấy danh sách product
const getAllProduct = () => {
    return axios.get(endpoint + "/product/all", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// api: POST thêm sản phẩm
const postAddProduct = (product) => {
    return axios.post(endpoint + "/product/add", product, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

// api: PUT update sản phẩm
const putUpdateProductApi = (data) => {
    return axios.put(endpoint + '/product/update', data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

// api: DELETE sản phẩm
const deleteProductApi = (id) => {
    return axios.delete(endpoint + '/product/delete', {
        params: {
            id: id
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

// api: tìm kiếm sản phẩm cho trang SeeProduct
const getProductToPageAdmin = (codeP = "", nameP = "", typeP = 0) => {
    const params = {
        codeP: codeP,
        nameP: nameP,
        typeP: typeP
    };

    return axios.get(endpoint + "/product/search", {
        params: params,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// api: get lấy danh sách admin
const getAllAdmin = () => {
    return axios.get(endpoint + "/user/all", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

// api: get lấy danh sách user
const getUserApi = () => {
    return axios.get(endpoint + "/user/all", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

// api: DELETE xoá người dùng
const delCustomerApi = (idUser) => {
    return axios.delete(endpoint + "/user/delete", {
        params: { idUser: idUser },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// api: GET lấy list order
const getOrderListApi = () => {
    return axios.get(endpoint + "/order/all", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

// api: POST update status order
const putUpdateStatusOrderApi = (idOrder, status) => {
    return axios.put(
        endpoint + "/order/update",
        null,  // No data in the request body
        {
            params: {
                idOrder: idOrder,
                status: status
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

// api: tìm kiếm order cho trang admin
const getSearchOrderApi = (orderCode, orderPayment, orderStatus) => {
    return axios.get(endpoint + '/order/search', {
        params: {
            codeOrder: orderCode,
            paymentOrder: orderPayment,
            status: orderStatus,
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// api: delete order với admin
const deleteOrderApi = (id) => {
    return axios.delete(endpoint + '/order/delete', {
        params: {
            id: id
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export {
    getAllAdmin,
    getUserApi,
    postAddProduct,
    getAllProduct,
    getOrderListApi,
    putUpdateStatusOrderApi,
    delCustomerApi,
    putUpdateProductApi,
    deleteProductApi,
    getProductToPageAdmin,
    getSearchOrderApi,
    deleteOrderApi
}
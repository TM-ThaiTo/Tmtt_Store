import axios from '../axios';
import constants from '../constants';

const endpoint = "/api/v1/order";
const authToken = localStorage.getItem(constants.ACCESS_TOKEN_KEY);

// api: Tạo đơn hàng
const postCreateOrder = (data) => {
    return axios.post(endpoint, data, {
        headers: {
            Authorization: `Bearer ${authToken}`
        },
    });
};

// api: Lấy danh sách đơn hàng
const getListOrderApi = (idUser) => {
    return axios.get(endpoint, {
        params: {
            id: idUser
        }, headers: {
            Authorization: `Bearer ${authToken}`
        },
    })
}

// api: Lấy chi tiết đơn hàng
const getDetailOrder = (idOrder) => {
    return axios.get('/apis/orders', {
        params: {
            id: idOrder,
        }
    })
}

// api: xác nhận thanh toán VNPay
const postUpdateVnpayApi = (data) => {
    return axios.post('/apis/orders/updatevnpay', data);
}

// api: xoá đơn hàng khi thanh toán không thành công
const delOrderVnpayApi = (id) => {
    return axios.delete('/apis/orders/deletevnpay', {
        params: {
            IdCodeMenthod: id,
        }
    })
}

// api: tìm kiếm order
const getSearchOrderApi = (orderCode, orderStatus, orderPayment) => {
    const params = {
        codeOrder: orderCode,
        paymentOrder: orderPayment,
        statusOrder: orderStatus,
    }
    return axios.get('/apis/orders/search-order', {
        params: params
    })
}

export {
    postCreateOrder,
    getListOrderApi,
    getDetailOrder,
    postUpdateVnpayApi,
    delOrderVnpayApi,
    getSearchOrderApi
}
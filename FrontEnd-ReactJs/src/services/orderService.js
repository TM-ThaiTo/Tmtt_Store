import axios from '../axios';

// api: Tạo đơn hàng
const postCreateOrder = (data) => {
    return axios.post("/apis/orders", data);
};

// api: Lấy danh sách đơn hàng
const getListOrderApi = (idUser) => {
    return axios.get('/apis/orders/list', {
        params: {
            id: idUser
        }
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
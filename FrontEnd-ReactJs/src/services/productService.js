import axios from '../axios';
import constants from '../constants';

const endpoint = "/api/v1/product"
const token = localStorage.getItem(constants.REFRESH_TOKEN_KEY);

// api: lấy sản phẩm theo id
const getProductById = (id) => {
    return axios.get(endpoint + "/one",
        {
            params: {
                id: id,
            }
        }
    );
};

// api: GET lấy tất cả sản phẩm
const getAPIProductList = () => {
    return axios.get("/apis/products/all");
}

// api: GET lấy sản phẩm và phân trang
const getProductAndPage = (PageNumber = 1, PageSize = 8) => {
    return axios.get(endpoint + "/page", {
        params: {
            page: PageNumber,
            size: PageSize
        }
    });
}

// api lấy sản phẩm theo loại (vd: laptop, ...)
const getProductType = (type, id) => {
    return axios.get(endpoint + "/type", {
        params:
        {
            idType: type,
            quantity: id,
        }
    });
}

// api lấy sản phẩm đã từng mua của người dùng đã đăng nhập
const getProductPurchased = () => {
    return axios.get(endpoint + "/list-reorder", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// api: tìm kiếm sản phẩm
const getSearchProductsApi = (value = '', page = 1, perPage = 8) => {
    return axios.get("/apis/products/search", {
        params: {
            value: value,
            page: page,
            perPage: perPage,
        }
    })
}

// api: filter sản phẩm v1
const getFilterProductApi = (
    type = 0,
    page = 0,
    perPage = 8,
) => {
    const params = {
        type,
        page,
        perPage,
    }
    return axios.get(endpoint + "/filter", {
        params
    });
}

// api: filter sản phẩm v2
const getFilterProductApi_v2 = (data) => {
    return axios.post("apis/products/filter_v2", data);
}

// api: lấy sản phẩm nỗi bật
const getProductOutstandong = () => {
    return axios.get(endpoint + "/outstanding-product");
}

export {
    getProductById,
    getAPIProductList,
    getProductAndPage,
    getProductPurchased,
    getProductType,
    getSearchProductsApi,
    getProductOutstandong,
    getFilterProductApi,
    getFilterProductApi_v2
}
import axios from '../axios';
import constants from '../constants';

const endpoint = "/api/v1/admin"
const token = localStorage.getItem(constants.REFRESH_TOKEN_KEY);


// api: GET lấy doanh thu theo tháng trong năm
const getMonthlyRevenue = (year = new Date().getFullYear()) => {
    return axios.get(endpoint + "/statistic/monthly", {
        params:
            { year: year },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

// api: GET lấy doanh thu theo list từng năm
const getStaAnnualRevenueApi = (
    startYear = new Date().getFullYear(),
    endYear = new Date().getFullYear(),
) => {
    return axios.get(endpoint + "/statistic/annual", {
        params:
        {
            startYear: startYear,
            endYear: endYear,
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

// api: lấy doanh thu ngày hiện tại
const getCard = () => {
    return axios.get(endpoint + '/statistic/card', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export {
    getMonthlyRevenue,
    getStaAnnualRevenueApi,
    getCard
}
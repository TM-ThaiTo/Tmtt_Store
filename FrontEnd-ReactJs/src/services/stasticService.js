import axios from '../axios';

// api: GET lấy doanh thu theo tháng trong năm
const getMonthlyRevenue = (year = new Date().getFullYear()) => {
    return axios.get("/apis/statistic/monthly-revenue", {
        params:
            { year: year }
    });
}

// api: GET lấy doanh thu theo list từng năm
const getStaAnnualRevenueApi = (
    startYear = new Date().getFullYear(),
    endYear = new Date().getFullYear(),
) => {
    return axios.get("/apis/statistic/annual-revenue", {
        params:
        {
            StartYear: startYear,
            EndYear: endYear,
        }
    });
}

// api: lấy doanh thu ngày hiện tại
const getCard = () => {
    return axios.get('/apis/statistic/card');
}

export {
    getMonthlyRevenue,
    getStaAnnualRevenueApi,
    getCard
}
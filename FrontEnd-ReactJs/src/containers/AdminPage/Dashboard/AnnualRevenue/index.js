import React, { Component } from 'react';
import { BarChartOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Bar } from 'react-chartjs-2';
import { getStaAnnualRevenueApi } from '../../../../services/stasticService.js';
import helpers from '../../../../helpers';

// tạo danh sách năm
function generateLabels(startYear = new Date().getFullYear(), endYear = new Date().getFullYear()) {
    let result = [];
    for (let i = startYear; i <= endYear; ++i) {
        result.push(`${i}`);
    }
    return result;
}

class AnnualRevenue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            startYear: 2010,
            endYear: new Date().getFullYear(),
            isLoading: true
        };
    }

    // event: gọi lấy doanh thu
    componentDidMount() {
        this.getStaAnnualRevenue();
    }

    componentWillUnmount() {
    }

    // fn: hàm goi api
    // api chứa tổng số tiền đã nhận của từng tháng 
    getStaAnnualRevenue = async () => {
        const { endYear } = this.state;
        try {
            const response = await getStaAnnualRevenueApi(this.state.startYear, endYear);
            if (response) {
                const data = response.data;
                this.setState({ data: data, isLoading: false });
            }
        } catch (error) {
            this.setState({ isLoading: false });
        }
    }

    // rendering
    render() {
        const { data, isLoading, startYear, endYear } = this.state;
        return (
            <>
                {isLoading ? (
                    <Spin
                        tip="Đang thống kê ..."
                        size="large"
                        indicator={<BarChartOutlined spin />}
                    />
                ) : (
                    <Bar
                        data={{
                            labels: generateLabels(startYear, endYear),
                            datasets: [
                                {
                                    backgroundColor: '#2EA62A',
                                    data: [...data],
                                },
                            ],
                        }}
                        options={{
                            legend: { display: false },
                            title: {
                                display: true,
                                text: `Doanh thu theo từng năm từ năm ${startYear} đến ${endYear}`,
                                fontSize: 18,
                            },
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            callback: function (value, index, values) {
                                                return value >= 1000000000
                                                    ? `${(value / 1000000000).toFixed(1)} tỷ`
                                                    : value >= 1000000
                                                        ? `${(value / 1000000).toFixed(1)} tr`
                                                        : helpers.formatProductPrice(value);
                                            },
                                        },
                                    },
                                ],
                            },
                        }}
                    />
                )}
            </>
        );
    }
}

export default AnnualRevenue;

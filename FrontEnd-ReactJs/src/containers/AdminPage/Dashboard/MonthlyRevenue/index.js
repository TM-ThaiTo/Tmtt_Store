import { Component } from 'react';
import { BarChartOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Bar } from 'react-chartjs-2';
import { getMonthlyRevenue } from '../../../../services/stasticService.js';
import helpers from '../../../../helpers/index.js';

class MonthlyRevenue extends Component {
    year = new Date().getFullYear();

    constructor(props) {
        super(props);
        this.state = {
            data: { thisYear: [], lastYear: [] },
            data: [],
            isLoading: true,
        };
    }

    generateLabels() {
        let result = [];
        for (let i = 0; i < 12; ++i) {
            result.push(`T${i + 1}`);
        }
        return result;
    }

    // event: gọi lấy data
    async componentDidMount() {
        try {
            const response = await getMonthlyRevenue(this.year);
            if (response) {
                const { thisYear, lastYear } = response.data;
                this.setState({ data: { thisYear, lastYear }, isLoading: false });
            }
        } catch (error) {
            this.setState({ isLoading: false });
        }
    }

    // fn: redering
    render() {
        const { data, isLoading } = this.state;

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
                            labels: this.generateLabels(),
                            datasets: [
                                {
                                    backgroundColor: '#2EA62A',
                                    data: [...data.lastYear],
                                    label: `Năm ${this.year - 1}`,
                                },
                                {
                                    backgroundColor: '#4670FF',
                                    data: [...data.thisYear],
                                    label: `Năm ${this.year}`,
                                },
                            ],
                        }}
                        options={{
                            legend: { display: true },
                            title: {
                                display: true,
                                text: `Doanh thu theo từng tháng của năm ${this.year - 1}, ${this.year}`,
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
                                                        ? `${(value / 1000000).toFixed(0)} tr`
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

export default MonthlyRevenue;

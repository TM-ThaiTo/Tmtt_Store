import React, { Component } from 'react';
import { getCard } from '../../../../services/stasticService.js';
import { message } from 'antd';
import { Spin } from 'antd';
import './index.scss'

class CardDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            revenue: 0,
            orders: 0,
            customers: 0,
            products: 0,
            isLoading: false,
        };
    }

    // fn: Hàm lấy doanh thu trong ngày
    getCards = async () => {
        this.setState({ isLoading: true });
        try {
            const response = await getCard();
            if (response && response.code === 0) {
                const { data } = response;
                this.setState({
                    revenue: data.revenue,
                    customers: data.customer,
                    products: data.product,
                    orders: data.order,
                    isLoading: false,
                })
            }
            else {
                message.error("Lỗi lấy thông tin card");
                this.setState({ isLoading: false });
            }
        } catch (error) {
            message.error("Lỗi lấy thông tin card");
            this.setState({ isLoading: false });
        }
    }

    componentDidMount = async () => {
        this.getCards();
    }
    formatProductPrice = (price) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };
    render() {
        const { isLoading, orders, revenue, products, customers } = this.state;
        return (
            <>
                {isLoading ? (
                    <Spin
                        tip="Đang thống kê ..."
                        size="large"
                    />
                ) : (
                    <div className='card-container'>
                        <div className='card-title'>
                            <span>Dashboard</span>
                        </div>

                        <div className='card-cards'>

                            {/* Doanh thu Today */}
                            <div className='card'>
                                <div className='card-inner'>
                                    <div>
                                        <span className='card-title-item'>Revenue |</span>
                                        <span> Today</span>
                                    </div>
                                    <i className="fas fa-dollar-sign card_icon"></i>
                                </div>
                                <span className='card-value'>{this.formatProductPrice(revenue)}</span>
                            </div>

                            {/* Order mới trong ngày */}
                            <div className='card'>
                                <div className='card-inner'>
                                    <div>
                                        <span className='card-title-item'>Order |</span>
                                        <span> Today</span>
                                    </div>
                                    <i className="far fa-list-alt card_icon"></i>
                                </div>
                                <span className='card-value'>{orders}</span>
                            </div>

                            {/* Số lượng người dùng đăng kí */}
                            <div className='card'>
                                <div className='card-inner'>
                                    <div>
                                        <span className='card-title-item'>Customers</span>
                                    </div>
                                    <i className="fas fa-users card_icon"></i>
                                </div>
                                <span className='card-value'>{customers}</span>
                            </div>

                            {/* Số lượng sản phẩm */}
                            <div className='card'>
                                <div className='card-inner'>
                                    <div>
                                        <span className='card-title-item'>Products</span>
                                    </div>
                                    <i className="fab fa-product-hunt card_icon"></i>
                                </div>
                                <span className='card-value'>{products}</span>
                            </div>
                        </div>
                    </div>
                )}

            </>
        )
    }
}

export default CardDashboard;

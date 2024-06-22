import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'antd';
import MonthlyRevenue from './MonthlyRevenue/index.js';
import AnnualRevenue from './AnnualRevenue/index.js';
import CardDashboard from './Card/index.js';

import './index.scss'

class Dashboard extends Component {
    render() {
        return (
            <>
                <CardDashboard />
                <Row className="p-32" gutter={[32, 32]}>

                    {/* doanh thu theo tháng */}
                    <Col span={24} xl={12}>
                        <div className="table-doanhthu">
                            <MonthlyRevenue />
                        </div>
                    </Col>
                    {/* Doanh thu theo năm */}
                    <Col span={24} xl={12}>
                        <div className="table-doanhthu">
                            <AnnualRevenue />
                        </div>
                    </Col>
                    {/* 
                    {/* Đơn hàng ở tỉnh nào nhiều nhất
                <Col span={24} xl={12}>
                    <div className="bg-white p-12 bor-rad-8 box-sha-home">
                        <TopOrders />
                    </div>
                </Col> */}
                </Row>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

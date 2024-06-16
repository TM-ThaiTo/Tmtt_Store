import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'antd';
import Brand from './Brand/Brand.js';
import SaleOff from './SaleOff/index.js';
import Filter from '../../components/Filter/index.js';
import ProductCarousel from '../SearchFilterPage/ProductCarousel//index.js'
import DoanhMuc from '../../components/DoanhMuc/index.js';
import AllProduct from './SanPham/index.js';
import './HomePage_User.scss'

class HomePage_User extends Component {

    render() {
        const isAuth = this.props.isAuth;
        return (
            <>
                <div className='homepage'>
                    <div className="banner-home">
                        <SaleOff />
                        <div className="filter-wrapper trans-center container">
                            <Filter />
                        </div>
                    </div>
                    <Row className="container">

                        {/* thương hiệu nổi bật */}
                        <Col span={24} className="m-b-32 hp-01">
                            <Brand />
                        </Col>

                        {/* nỗi bật */}
                        {/* <DoanhMuc
                            type="NOIBAT"
                            currentPage={1}
                            productsPerPage={8}
                        /> */}

                        {/* Carousel */}
                        <Col span={24} className="hp-03">
                            <ProductCarousel />
                        </Col>

                        {/* Doanh muc Laptop */}
                        <DoanhMuc
                            type={5}
                            count={10}
                            currentPage={1}
                            productsPerPage={4}
                        />

                        {/* Doanh muc Man hinh */}
                        <DoanhMuc
                            type={12}
                            count={10}
                            currentPage={1}
                            productsPerPage={4}
                        />

                        {/* Doanh muc Gear */}
                        <DoanhMuc
                            type={13}
                            count={10}
                            currentPage={1}
                            productsPerPage={4}
                        />

                        {/* <All_Products /> */}
                        <AllProduct />

                        {/* Doanh muc dành cho bạn */}
                        {isAuth &&
                            <DoanhMuc
                                type="FORYOU"
                                currentPage={1}
                                productsPerPage={4}
                            />
                        }
                    </Row>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuth: state.authenticate.isAuth,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage_User);

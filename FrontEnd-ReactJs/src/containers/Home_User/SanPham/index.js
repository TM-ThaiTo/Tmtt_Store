import React, { Component } from 'react';
import { Col, Pagination, Row, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { getProductAndPage } from '../../../services/productService';
import ProductView from '../../../components/ProductView';
import "./index.scss";

class AllProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            currentPage: 1,
            productsPerPage: 8,
            total: 0,
            isLoading: true,
        };
    }

    // event: Hàm gọi đầu tiên khi vừa vào component
    componentDidMount() {
        this.getAllProducts(this.state.currentPage);
    }

    componentWillUnmount() {
        if (this.cancelToken) {
            this.cancelToken.cancel('Component unmounted');
        }
    }

    // event: Update sản phẩm liên tục
    componentDidUpdate(prevProps, prevState) {
        if (this.state.currentPage !== prevState.currentPage) {
            this.getAllProducts(this.state.currentPage);
        }
    }

    // fn: Hàm call API lấy danh sách sản phẩm theo trang
    getAllProducts = async (currentPage) => {
        try {
            const response = await getProductAndPage(currentPage, this.state.productsPerPage);
            if (response) {
                const { data, count } = response;
                this.setState({
                    list: data,
                    total: count,
                    isLoading: false,
                });
            }
        } catch (error) {
            console.log("Error: ", error);
            this.setState({
                isLoading: false,
            });
        }
    };

    // fn: Hàm hiển thị Card Sản phẩm
    showProducts = (list) => {
        return list.map((product, index) => {
            const { avt, name, price, discount, stock, id } = product;
            return (
                <Col key={index} span={24} sm={12} lg={8} xl={6}>
                    <Link to={`/product/${id}`}>
                        <ProductView
                            className="m-auto"
                            name={name}
                            price={price}
                            stock={stock}
                            avtUrl={avt}
                            discount={parseFloat(discount)}
                            height={400}
                        />
                    </Link>
                </Col>
            );
        });
    };

    // event: sự kiện nhấn đổi trang
    handlePageChange = (page) => {
        this.setState({
            currentPage: page,
            isLoading: true,
        });
    };

    // rendering
    render() {
        const { list, isLoading, currentPage, productsPerPage, total } = this.state;

        return (
            <Col span={24} className="hp-01">
                <Row className="p-16" style={{ minHeight: 400 }} gutter={[16, 16]}>
                    <Col span={24}>
                        <h2 className="font-weight-700">Tất cả sản phẩm</h2>
                        <div className="underline-title"></div>
                    </Col>

                    {isLoading ? (
                        <Spin
                            className="trans-center"
                            tip="Đang tải sản phẩm ..."
                            size="large"
                        />
                    ) : (
                        <>
                            {this.showProducts(list)}
                            <Col className="item" span={24}>
                                <Pagination
                                    className="nut"
                                    current={currentPage}
                                    pageSize={productsPerPage}
                                    total={total}
                                    onChange={(p) => this.handlePageChange(p)}
                                    showSizeChanger={false}
                                />
                            </Col>
                        </>
                    )}
                </Row>
            </Col>
        );
    }
}

export default AllProduct;

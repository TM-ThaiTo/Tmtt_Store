import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Pagination, Row } from 'antd';
import { Link } from 'react-router-dom';
import { getProductType, getProductPurchased, getProductOutstandong } from '../../services/productService';
import ProductView from '../ProductView';
import './index.scss'

class DoanhMuc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            currentPage: props.currentPage,
            productsPerPage: props.productsPerPage,
            type: 0,
            title: "",
            total: 0,
        };
    }

    componentDidMount() {
        const typeMapping = {
            5: {
                type: 5,
                title: "Máy tính xách tay",
            },
            13: {
                type: 13,
                title: "Phụ kiện máy tính",
            },
            12: {
                type: 12,
                title: "Màn hình",
            },
            FORYOU: {
                type: "foryou",
                title: "Sản phẩm ưa thích",
            },
            NOIBAT: {
                type: "noibat",
                title: "Sản phẫm nỗi bật",
            },
        };

        const type = this.props.type;

        if (typeMapping[type]) {
            this.setState({
                type: typeMapping[type].type,
                title: typeMapping[type].title,
            }, () => {
                if (type === "FORYOU") {
                    this.getProductForYou();
                } else if (type === "NOIBAT") {
                    this.getProductNoiBat();
                } else {
                    this.getProductToType();
                }
            });
        }
    }

    // get product theo loại
    getProductToType = async () => {
        const type = this.state.type;
        const count = this.props.count;
        try {
            const response = await getProductType(type, count);
            if (response) {
                const data = response.data;
                const count = response.count;
                this.setState({
                    list: data,
                    total: count,
                    isLoading: false,
                });
            }
        } catch (error) {
            console.log("Lỗi lấy Laptop");
        }
    };

    // fn: get sản phâm đã mua
    getProductForYou = async () => {
        try {
            const response = await getProductPurchased();
            if (response) {
                const data = response.data;
                const count = response.count;
                this.setState({
                    list: data,
                    total: count,
                    isLoading: false,
                });
            }
        } catch (error) {
            console.log("Lỗi lấy sản phẩm cho bạn");
        }
    }

    // fn: get sản phẩm nỗi bật
    getProductNoiBat = async () => {
        try {
            const response = await getProductOutstandong();
            if (response) {
                const data = response.data;
                const count = response.count;
                this.setState({
                    list: data,
                    total: count,
                    isLoading: false,
                });
            }
        } catch (error) {
            console.log("Lỗi lấy danh sách sản phẩm nỗi bật");
        }
    }

    // fn: show product
    showProducts = (list) => {
        list = list ? list : [];
        const { currentPage, productsPerPage } = this.state;
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = list.slice(indexOfFirstProduct, indexOfLastProduct);

        return currentProducts.map((product, index) => {
            const { avt, name, price, discount, stock, id, rates } = product;
            return (
                <Col key={index} span={24} sm={12} lg={8} xl={6}>
                    <Link to={`/product/${id}`}>
                        <ProductView
                            className="m-auto"
                            name={name}
                            price={price}
                            stock={stock}
                            avtUrl={avt}
                            rate={rates}
                            discount={parseFloat(discount)}
                            height={400}
                        />
                    </Link>
                </Col>
            );
        });
    };

    // fn: hàm chuyển trang
    handlePageChange = (page) => {
        this.setState({
            currentPage: page,
        });
    };

    render() {
        const { list, currentPage, productsPerPage, total, title } = this.state;
        if (total === 0) {
            return null; // Trả về null sẽ không render gì cả
        }
        return (
            <Col span={24} className="hp-01">
                <Row className="p-16" style={{ minHeight: 400 }} gutter={[16, 16]}>
                    <Col span={24}>
                        <h2 className="font-weight-700">{title}</h2>
                        <div className="underline-title"></div>
                    </Col>
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
                </Row>
            </Col>
        );
    }
}

// map redux đến react
const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoanhMuc);


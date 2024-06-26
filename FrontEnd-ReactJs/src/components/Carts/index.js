import React, { Component } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Button, Col, Popconfirm, Row, message } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { postUpdateVnpayApi, delOrderVnpayApi } from '../../services/orderService.js';
import CartOverview from './Overview';
import CartPayment from './Payment';
import cartActions from '../../store/actions/cartActions';
import './index.scss';

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carts: [],
            isInitialized: false
        };
        this.updateStatusOrderCalled = false; // Biến cờ
    }

    // fn: Hàm để lấy thông tin từ URL
    getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const queryParams = {};
        for (const [key, value] of params.entries()) {
            queryParams[key] = value;
        }
        return queryParams;
    }

    // fn: Hàm xữ lý thanh toán vnpay
    updateStatusOrder = async (queryParams) => {
        if (queryParams != null) {
            // kiểm tra trạng thái thanh toán
            if (queryParams.vnp_TransactionStatus === "00") {
                const idCodeMenthod = queryParams.vnp_TxnRef;
                const response = await postUpdateVnpayApi(idCodeMenthod);
                if (response && response.code === 0) {
                    this.onDelAllCarts();
                    // this.setState({ isInitialized: false });
                    return;
                }
            }
            else if (queryParams.vnp_TransactionStatus === "02") {
                const response = await delOrderVnpayApi(queryParams.vnp_TxnRef);
                if (response && response.code === 0) {
                    return;
                } else {
                    return;
                }
            } else {
                return;
            }
        } else {
            return;
        }
    }

    // event: Lấy dữ liệu từ localStorage
    componentDidMount = async () => {
        if (!this.state.isInitialized) {
            const cartsFromLocalStorage = JSON.parse(localStorage.getItem('carts'));
            this.setState({ carts: cartsFromLocalStorage, isInitialized: true });

            // Lấy thông tin từ URL để thanh toán 
            const queryParams = this.getQueryParams();
            if (queryParams == null) {
                return;
            } else if (!this.updateStatusOrderCalled) {
                this.updateStatusOrder(queryParams);
                // this.updateStatusOrderCalled = true; // Đặt cờ thành true sau khi gọi
                return;
            }
        }
    }

    // event: Xoá tất cả sản phẩm trong cart
    onDelAllCarts = () => {
        this.props.resetCart(); // Dispatch action through props
    };

    // event: Kiểm tra thay đổi và update liên tục
    componentDidUpdate() {
        const cartsFromLocalStorage = JSON.parse(localStorage.getItem('carts'));
        const cartsString = JSON.stringify(this.state.carts);
        const cartsFromLocalStorageString = JSON.stringify(cartsFromLocalStorage);

        if (cartsString !== cartsFromLocalStorageString) {
            message.success("Đặt hàng thành công vui lòng kiểm tra đơn hàng");
            this.setState({ carts: cartsFromLocalStorage });
        }
    }

    // fn: render
    render() {
        return (
            <div
                className="Cart-Detail-View container"
            >
                <Row gutter={[16, 32]}>
                    {/* Hiển thị đường dẫn trang */}
                    <Col span={24} className="page-position">
                        <Link to="/">
                            <HomeOutlined className="icon-home" />
                        </Link>
                        <span className="r-arrow p-lr-8 font-weight-500">{`>`}</span>
                        <span className="cart-name p-8 font-weight-500 bg-white">
                            Giỏ hàng của bạn
                        </span>
                    </Col>

                    {/* hiển thị danh sách item */}
                    {this.state.carts && this.state.carts.length > 0 ? (
                        <>
                            {/* Tổng sản phẩm */}
                            <Col span={24} className="d-flex justify-content-between">
                                <h2>
                                    Giỏ hàng của bạn
                                    <b>{` ${this.state.carts.reduce(
                                        (a, b) => a + parseInt(b.amount),
                                        0,
                                    )} `}</b>
                                    sản phẩm
                                </h2>
                                <Popconfirm
                                    title="Bạn có chắc muốn xoá toàn bộ sản phẩm trong giỏ hàng ?"
                                    placement="left"
                                    okButtonProps={{ type: 'primary' }}
                                    onConfirm={this.onDelAllCarts}
                                    okText="Đồng ý"
                                    cancelText="Huỷ bỏ">
                                    <Button type="link" danger size="large">
                                        Xoá tất cả
                                    </Button>
                                </Popconfirm>
                            </Col>

                            {/* Chi tiết giỏ hàng */}
                            <Col span={24} md={16}>
                                <CartOverview carts={this.state.carts}
                                    delCartItem={this.props.delCartItem}
                                    updateCartItem={this.props.updateCartItem} />
                            </Col>

                            {/* Thanh toán */}
                            <Col span={24} md={8}>
                                <CartPayment carts={this.state.carts} />
                            </Col>
                        </>
                    ) : (
                        <Col span={24} className="t-center" style={{ minHeight: '90vh' }}>
                            <h2 className="m-tb-16" style={{ color: '#888' }}>
                                Hiện tại bạn chưa có sản phẩm nào trong giỏ hàng
                            </h2>
                            <Link to="/">
                                <Button type="primary" size="large">
                                    Mua sắm ngay nào
                                </Button>
                            </Link>
                        </Col>
                    )}
                </Row>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        resetCart: () => dispatch(cartActions.resetCart()),
        delCartItem: (item) => dispatch(cartActions.delCartItem(item)),
        updateCartItem: (item, value) => dispatch(cartActions.updateCartItem(item, value))
    };
}
export default connect(null, mapDispatchToProps)(Cart);

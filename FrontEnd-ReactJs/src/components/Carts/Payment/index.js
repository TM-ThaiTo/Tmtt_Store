import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import constants from '../../../constants/index';
import helpers from '../../../helpers';
import PropTypes from 'prop-types';

class CartPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tamtinh: 0,
            giamGia: 0,
        };
    }

    // fn: hàm xữ lý đầu tiên khi load vào class
    componentDidMount() {
        this.calculatePrice(this.props.cartsProp);
    }

    //fn: render liên tục để cập nhật giá tiền
    componentDidUpdate(prevProps) {
        if (this.props.cartsProp !== prevProps.cartsProp) {
            this.calculatePrice(this.props.cartsProp);
        }
    }

    // fn: hàm tính toán và cập nhật state
    calculatePrice = (carts) => {
        const tamTinh = carts.reduce(
            (a, b) => a + (b.price) * b.amount, 0
        );
        const giamGia = carts.reduce(
            (a, b) => a + ((b.price * b.discount) / 100) * b.amount,
            0,
        );
        this.setState({
            tamTinh: tamTinh,
            giamGia: giamGia
        });
    }

    render() {
        // const { isCheckout, transportFee, onCheckout, isLoading } = this.props;
        const { tamTinh, giamGia } = this.state;
        // const { isCheckout, transportFee, onCheckout, isLoading, totalAmount, paidAmount } = this.props;
        const { isCheckout, transportFee, onCheckout, isLoading, } = this.props;

        return (
            <div className="Payment bg-white p-16">
                <h2 className="m-b-8">Tiến hành thanh toán</h2>
                <div className="d-flex justify-content-between m-b-6">
                    <span className="font-size-16px" style={{ color: '#aaa' }}>
                        Tạm tính
                    </span>
                    <b>{helpers.formatProductPrice(tamTinh)}</b>
                </div>
                <div className="d-flex justify-content-between m-b-6">
                    <span className="font-size-16px" style={{ color: '#aaa' }}>
                        Phí vận chuyển
                    </span>
                    <b>{helpers.formatProductPrice(transportFee)}</b>
                </div>
                <div className="d-flex justify-content-between m-b-6">
                    <span className="font-size-16px" style={{ color: '#aaa' }}>
                        Giảm giá
                    </span>
                    <b>{helpers.formatProductPrice(giamGia)}</b>
                </div>
                <div className="d-flex justify-content-between">
                    <span className="font-size-16px" style={{ color: '#aaa' }}>
                        Thành tiền
                    </span>
                    <b style={{ color: 'red', fontSize: 20 }}>
                        {helpers.formatProductPrice(
                            tamTinh - giamGia + transportFee
                        )}
                    </b>
                </div>
                <div className="t-end">
                    <span style={{ color: '#aaa', fontSize: 16 }}>
                        {`(Đã bao gồm VAT)`}
                    </span>
                </div>

                {isCheckout ? (
                    <Button
                        onClick={onCheckout}
                        className="m-t-16 d-block m-lr-auto w-100"
                        type="primary"
                        size="large"
                        loading={isLoading}
                        style={{ backgroundColor: '#3555c5', color: '#fff' }}>
                        ĐẶT HÀNG NGAY
                    </Button>
                ) : (
                    <Link to={constants.ROUTES.PAYMENT}>
                        <Button
                            className="m-t-16 d-block m-lr-auto w-100"
                            type="primary"
                            size="large"
                            style={{ backgroundColor: '#3555c5', color: '#fff' }}>
                            THANH TOÁN
                        </Button>
                    </Link>
                )}
            </div>
        );
    }
}

CartPayment.defaultProps = {
    isCheckout: false,
    transportFee: 0,
    isLoading: false,
};

CartPayment.propTypes = {
    isCheckout: PropTypes.bool,
    transportFee: PropTypes.number,
    onCheckout: PropTypes.func,
    isLoading: PropTypes.bool,
    carts: PropTypes.arrayOf(
        PropTypes.shape({
            code: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            amount: PropTypes.number.isRequired,
            avt: PropTypes.string.isRequired,
            discount: PropTypes.number.isRequired
        })
    ).isRequired
};

const mapStateToProps = state => {
    return {
        cartsProp: state.cart,
    };
};
export default connect(mapStateToProps)(CartPayment);


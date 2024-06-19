import React, { Component } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Avatar, InputNumber, Tooltip } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import helpers from '../../../helpers/index.js';
import PropTypes from 'prop-types';

class CartItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            name: props.name,
            code: props.code,
            avt: props.avt,
            stock: props.stock,
            discount: props.discount,
            price: props.price,
            amount: props.amount,
            index: props.index,
            onDelCartItem: props.onDelCartItem,
            onUpdateNumOfProd: props.onUpdateNumOfProd,
            priceG: 0,
            priceD: 0
        };
    }

    // fn: sự kiện update số lượng sản phẩm
    on_UpdateNumOfProd = (value) => {
        const { index, onUpdateNumOfProd, price, discount } = this.state;
        onUpdateNumOfProd(index, value); // Gọi hàm onUpdateNumOfProd từ props
        const calculatedPrice = price * value * (1 - discount / 100);
        this.setState({
            amount: value,
            priceG: calculatedPrice,
            priceD: helpers.formatProductPrice(calculatedPrice)
        }); // Cập nhật giá trị amount, priceG và priceD trong state
    }

    // event: Cập nhật lại giá, số lượng, discount khi có sự thay đổi trong giỏ hàng 
    componentDidUpdate(prevProps, prevState) {
        // Kiểm tra xem props hoặc state đã thay đổi hay chưa
        if (
            prevProps.price !== this.state.price ||
            prevState.amount !== this.state.amount ||
            prevState.discount !== this.state.discount
        ) {
            const priceG = this.state.price * this.state.amount;

            // Tính toán giá dựa trên giá, số lượng và chiết khấu
            const calculatedPrice = this.props.price * this.state.amount * (1 - this.state.discount / 100);

            // Cập nhật giá trị state
            this.setState({
                priceG: helpers.formatProductPrice(priceG),
                priceD: helpers.formatProductPrice(calculatedPrice)
            });
        }
    }

    //fn: rendering
    render() {
        const {
            id,
            name,
            code,
            avt,
            stock,
            amount,
            index,
            onDelCartItem,
            // onUpdateNumOfProd,
        } = this.state;

        const priceG = this.state.price * this.state.amount;
        // Tính toán giá dựa trên giá, số lượng và chiết khấu
        const priceD = this.props.price * this.state.amount * (1 - this.state.discount / 100);

        return (
            <div className="d-flex bg-white p-12 bor-rad-4 justify-content-between">
                {/* sản phẩm */}
                <div className="d-flex flex-grow-1">
                    <Avatar src={avt} alt="Photo" shape="square" size={64} />
                    <div className="d-flex flex-direction-column p-10 ">
                        <Link to={`/product/${id}`} className="font-size-16px">
                            <Tooltip title={name}>
                                {helpers.reduceProductName(name, 20)}
                            </Tooltip>
                        </Link>
                        <span style={{ color: '#aaa' }}>{code}</span>
                    </div>
                </div>

                {/*  Thêm giảm sản phẩm */}
                <div className="d-flex align-i-center" style={{ flexBasis: 128 }}>
                    <DeleteOutlined
                        className="m-r-18 icon-del-item"
                        onClick={() => onDelCartItem(index)}
                    />
                    <div>
                        <InputNumber
                            height={20}
                            min={1}
                            max={stock}
                            value={amount}
                            onChange={this.on_UpdateNumOfProd} // Gọi hàm on_UpdateNumOfProd mới được định nghĩa
                            size="large"
                            style={{ borderColor: '#3555C5' }}
                        />
                    </div>
                </div>

                {/* Giá */}
                <div
                    className="d-flex flex-direction-column align-i-end"
                    style={{ flexBasis: 200 }}>
                    <b className="font-size-18px" style={{ color: '#3555C5' }}>
                        {helpers.formatProductPrice(priceD)}
                    </b>

                    <span style={{ textDecoration: 'line-through', color: '#aaa' }}>
                        {helpers.formatProductPrice(priceG)}
                    </span>
                </div>
            </div>
        );
    }
}

CartItem.defaultProps = {
    _id: '',
    avt: '',
    code: '',
    discount: 0,
    name: '',
    price: 0,
    stock: 0,
    amount: 1,
};

CartItem.propTypes = {
    onDelCartItem: PropTypes.func,
    onUpdateNumOfProd: PropTypes.func,
    index: PropTypes.any,
    _id: PropTypes.string,
    avt: PropTypes.string,
    code: PropTypes.string,
    discount: PropTypes.number,
    amount: PropTypes.number,
    name: PropTypes.string,
    price: PropTypes.number,
    stock: PropTypes.number,
};

export default withRouter(CartItem);


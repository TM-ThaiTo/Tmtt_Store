import React, { Component } from 'react';
import { Avatar, Button, Card, List } from 'antd';
import { Link } from 'react-router-dom';
import constants from '../../../constants/index.js';
import helpers from '../../../helpers/index.js';
import PropTypes from 'prop-types';
import './index.scss';

const { Meta } = Card;

class CartView extends Component {
    totalPrice(list) {
        return list.reduce((total, item) => {
            total += item.price * item.amount;
            return total;
        }, 0);
    }
    render() {
        const { list } = this.props;
        const length = list.length;
        return (
            <div
                className="cart-view p-8"
                style={{ backgroundColor: '#fff', height: '500', width: '180' }}>

                {/* render các sản phẩm */}
                <div className="cart-items p-8">
                    {length && length > 0 ? (
                        <List
                            itemLayout="vertical"
                            size="large"
                            dataSource={list}
                            renderItem={(item) => (
                                <Card style={{ width: 300 }}>
                                    <Meta
                                        avatar={
                                            <Avatar
                                                shape="square"
                                                style={{ width: 80, height: 50 }}
                                                src={item.avt}
                                            />
                                        }
                                        title={item.name}
                                        description={`Số lượng: ${item.amount}`}
                                    />
                                    <p className="product-price">
                                        {helpers.formatProductPrice(item.price)}
                                    </p>
                                </Card>
                            )}
                        />
                    ) : (
                        <p
                            className='no-items'
                        >
                            There are no items in the cart.
                        </p>
                    )}
                </div>

                {/* render nút và tổng tiền */}
                <div className="cart-additional btn-drop">
                    <h3>Tổng tiền: {helpers.formatProductPrice(this.totalPrice(list))}</h3>
                    <Link to={length > 0 ? constants.ROUTES.CART : '/'}>
                        <Button
                            className="btn"
                            type="primary"
                            size="large">
                            {length > 0 ? 'Đến giỏ hàng' : 'Mua sắm ngay'}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }
}

CartView.propTypes = {
    list: PropTypes.array,
};

export default CartView;

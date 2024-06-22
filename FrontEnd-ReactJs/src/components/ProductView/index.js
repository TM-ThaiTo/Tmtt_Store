import React, { Component } from 'react';
import { Card, Rate } from 'antd';
import PropTypes from 'prop-types';
import './index.scss';

class ProductView extends Component {
    componentDidMount() {
        this.setAvtHeight();
    }

    setAvtHeight() {
        document
            .querySelectorAll('.ant-card-cover')
            .forEach((item) => (item.style.height = `${this.props.height / 2}px`));
    }

    // fn: hàm rút gọn tên sản phẩm
    reduceProductName = (name, length = 30) => {
        let result = name;
        if (name && name.length >= length) {
            result = name.slice(0, length) + ' ...';
        }
        return result;
    };

    // fn: hàm format giá sản phẩm
    formatProductPrice = (price) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    render() {
        const {
            className,
            name,
            price,
            avtUrl,
            discount,
            stock,
            action,
            height,
            rate,
            maxWidth,
        } = this.props;

        return (
            <Card
                className={`Product-View p-b-18 ${className}`}
                id="card-item"
                style={{ height, maxWidth }}
                loading={false}
                cover={
                    <div className="img-container">
                        {/* <img className="img" src={avtUrl} alt="Product Photo" /> */}
                        <img className="img" src={avtUrl} alt="" />
                    </div>
                }
                hoverable
            >
                {/* Tên sản phẩm */}
                <div className="m-b-10 text-name">
                    {this.reduceProductName(name)}
                </div>

                {/* Giá sản phẩm */}
                <div className="Product-View-price m-b-10">
                    {!price && (
                        <span className="Product-View-price--contact">Liên hệ</span>
                    )}
                    {price > 0 && (
                        <>
                            <span className="Product-View-price--main font-size-20px font-weight-b text-price">
                                {this.formatProductPrice(price)}
                            </span>
                            {discount > 0 && (
                                <div>
                                    <span className="Product-View-price--cancel font-weight-500 ">
                                        {this.formatProductPrice(
                                            price + (discount * price) / 100
                                        )}
                                    </span>
                                    <span className="m-l-8 Product-View-price--discount">
                                        {discount}%
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Số lượng hàng còn, chỉ hiển thị khi còn ít hơn 5 */}
                {stock <= 5 && stock > 0 && (
                    <div className="Product-View-stock font-size-14px">
                        chỉ còn {stock} sản phẩm
                    </div>
                )}

                {/* Số lượng hàng còn, chỉ hiển thị khi còn ít hơn 5 */}
                {stock === 0 && (
                    <b className="Product-View-stock font-size-16px">Đang hết hàng</b>
                )}

                {/* Đánh giá sản phẩm */}
                <div className="Product-View-rate m-b-10">
                    {rate == null || rate === 0 ? (
                        <span className="ant-rate-text">(Chưa có đánh giá)</span>
                    ) : (
                        <>
                            <Rate disabled defaultValue={rate} />
                            <span className="ant-rate-text">({rate} sao)</span>
                        </>
                    )}
                </div>

                {/* Các nút bấm thêm nếu có */}
                <div className="d-flex m-t-10 justify-content-end">
                    {action.length > 0 && action.map((Item) => Item)}
                </div>
            </Card>
        );
    }
}

// default props
ProductView.defaultProps = {
    price: 0,
    stock: 1,
    action: [],
    maxWidth: 280,
    height: 480,
    className: '',
};

// check prop type
ProductView.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    avtUrl: PropTypes.string,
    discount: PropTypes.number,
    stock: PropTypes.number,
    action: PropTypes.any,
    style: PropTypes.object,
    height: PropTypes.number,
    maxWidth: PropTypes.number,
};

export default ProductView;

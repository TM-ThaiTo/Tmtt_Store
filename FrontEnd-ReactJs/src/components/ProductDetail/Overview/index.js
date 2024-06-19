import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Col, Image, InputNumber, message, Rate, Row } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import ImgLoadFailed from '../../../assets/imgs/loading-img-failed.png';
import constants from '../../../constants';
import helpers from '../../../helpers';
import cartActions from '../../../store/actions/cartActions';
import './index.scss';

class ProductOverview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numOfProduct: 1,
            avtIndex: 0,
            carts: [],
        };
    }

    // Lấy dữ liệu từ localStorage
    componentDidMount() {
        const cartsFromLocalStorage = JSON.parse(localStorage.getItem('carts'));
        this.setState({ carts: cartsFromLocalStorage });
    }

    // Hàm đếm số sản phẩm đó trong giỏ hàng
    countItemInCart = (productCode, carts) => {
        let count = 0;
        if (carts) {
            carts.forEach((item) => {
                if (item.code === productCode) count += item.amount;
            });
        }
        return count;
    };

    // fn: hiên thị danh sách hình ảnh sp
    showCatalogs = (catalog) => {
        return catalog.map((item, index) => (
            <Image
                key={index}
                src={item}
                width={48}
                className={`catalog-item p-8 ${index === this.state.avtIndex ? 'active' : ''}`}
                onMouseEnter={() => this.setAvtIndex(index)}
            />
        ));
    };

    // fn: hiển thị vài thông tin cơ bản của sản phẩm
    showOverviewInfo = (product) => {
        let result = [];
        let i = 0;
        for (let key in product) {
            if (i >= 5) break;
            if (typeof product[key] === 'string') {
                result.push(
                    <p key={i++} className="m-b-8">
                        {`- ${helpers.convertProductKey(key)}: ${product[key]}`}
                    </p>,
                );
            }
        }
        return result;
    };

    // fn: Thêm vào giỏ hàng
    addCart = () => {
        const { code, name, price, avt, id, discount, stock } = this.props.dataProduct.product;
        const { numOfProduct } = this.state;
        let product = {
            code,
            name,
            price,
            amount: numOfProduct,
            avt,
            discount,
            stock,
            id,
        };
        this.setState({ numOfProduct: 1 });
        this.props.addToCart(product);
        message.success('Thêm vào giỏ hàng thành công');
    };

    // fn: Set index của hình ảnh được chọn
    setAvtIndex = (index) => {
        this.setState({ avtIndex: index });
    };

    // hàm đổi chiều dài ngôn ngữ sau này gộp 
    // fn: hàm rút gọn tên sản phẩm
    reduceProductName = (name, length = 64) => {
        let result = name;
        if (name && name.length >= length) {
            result = name.slice(0, length) + ' ...';
        }
        return result;
    };

    // fn: set giá trị số lượng sản phẩm trong state
    setNumberOfProduct = (value) => {
        this.setState({
            numOfProduct: value // Cập nhật giá trị của numOfProduct bằng giá trị của tham số value
        });
    }

    //fn: render
    render() {
        const { dataProduct } = this.props;
        const { avtIndex } = this.state;
        const {
            // id,
            avt,
            name,
            brand,
            code,
            price,
            rate,
            discount,
            stock,
            totalComment,
        } = dataProduct.product;

        const { catalogs } = dataProduct.detail;
        const imgList = [avt, ...catalogs];
        const priceBefore = price + (price * discount) / 100;
        // tính rate
        const rateTotal = totalComment;
        let newRate = rate;
        if (newRate == null) {
            newRate = 5;
        }
        const rateAvg = newRate.toFixed(1);

        // lấy carts trong localStorage
        const carts = this.state.carts;
        const currentStock = stock - this.countItemInCart(code, carts);

        return (
            <Row className="Product-Overview">
                {/* Hình ảnh và thông số cơ bản sản phẩm */}
                <Col span={24} md={8}>
                    <div
                        style={{ height: 200, width: 300 }}
                        className='img-avt hinhanh'>
                        <Image
                            style={{ height: 150, width: 150 }}
                            fallback={ImgLoadFailed}
                            src={imgList[avtIndex]}
                        />
                    </div>

                    <div className="listHinhAnh" >
                        {this.showCatalogs(imgList)}
                    </div>
                </Col>

                {/* Tên và thông tin cơ bản */}
                <Col span={24} md={16} className="p-l-16">
                    {/* Tên sp */}
                    <h2 className="fs_24px">
                        {() => helpers.reduceProductName(name, 140)}
                    </h2>

                    {/* Đánh giá sản phẩm */}
                    <div className="p-tb-8">
                        <Rate disabled defaultValue={rateAvg} allowHalf />
                        <a href="#evaluation" className="m-l-8">
                            (Có {rateTotal} đánh giá)
                        </a>
                    </div>

                    {/* Mã, thương hiệu */}
                    <div
                        className="font-size-16px font-weight-400"
                        style={{ color: '#aaa' }}
                    >
                        Thương hiệu:
                        <span className="product-brand font-weight-500">&nbsp;{brand}</span>
                        &nbsp; | &nbsp;<span>{code}</span>
                    </div>

                    {/* Giá */}
                    <h1 className="price-sp">
                        {price === 0 ? 'Liên hệ' : helpers.formatProductPrice(priceBefore)}
                    </h1>
                    {discount > 0 && price > 0 && (
                        <>
                            <h3 className="discount-title" style={{ color: '#333' }}>
                                Bạn có 1 mã giảm giá {discount}% cho sản phẩm này
                            </h3>
                            <div className="discount-sp">
                                <span className="discount-price">
                                    Giá: {helpers.formatProductPrice(price)}
                                </span>
                                <span className="discount-price1">
                                    Đã giảm thêm: {helpers.formatProductPrice(priceBefore - price)}
                                    &nbsp;
                                    <span className="discount-decr"></span>
                                </span>
                                <div className="discount-mark"></div>
                            </div>
                        </>
                    )}
                    <div className='add_cart'>
                        {/* Chọn số lượng */}
                        <div className="btn-chon-so-luong">
                            {currentStock === 0 ? (
                                <h3 className="item-het-hang" style={{ color: 'red' }}>
                                    <i>Sản phẩm hiện đang hết hàng !</i>
                                </h3>
                            ) : (
                                <>
                                    <h3 className="item-het-hang">Chọn số lượng: </h3>
                                    <InputNumber
                                        className='input-so-luong'
                                        name="numOfProduct"
                                        size="middle"
                                        value={this.state.numOfProduct}
                                        min={1}
                                        max={currentStock}
                                        onChange={(value) => this.setNumberOfProduct(value)}
                                    />
                                </>
                            )}
                        </div>

                        {/* Button*/}
                        {price > 0 && currentStock > 0 ? (
                            <div className="btn-hang ">
                                <Button
                                    onClick={() => this.addCart()}
                                    disabled={stock ? false : true}
                                    size="large"
                                    className="btn-item "
                                    style={{ backgroundColor: '#3555c5' }}>
                                    THÊM GIỎ HÀNG
                                </Button>

                                <Button
                                    onClick={() => this.addCart()}
                                    disabled={stock ? false : true}
                                    size="large"
                                    className=" btn-item"
                                    style={{ backgroundColor: '#39B3D7' }}>
                                    <Link to={constants.ROUTES.PAYMENT}> MUA NGAY LUÔN</Link>
                                </Button>
                            </div>
                        ) : (
                            <Button
                                size="large"
                                className="lienhe-hethang btn-group-item"
                                style={{ backgroundColor: '#3555c5' }}>
                                <a href="https://www.facebook.com/to.trinh.520900/" target="blank">
                                    <PhoneOutlined style={{ fontSize: 18 }} className="m-r-8" /> LIÊN HỆ
                                </a>
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addToCart: (item) => dispatch(cartActions.addToCart(item))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProductOverview));

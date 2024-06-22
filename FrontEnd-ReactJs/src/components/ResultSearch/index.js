import React, { Component } from 'react';
import { Button, Col, Row, Spin, InputNumber } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import productNotFoundUrl from '../../assets/imgs/no-products-found.png';
import ProductView from '../ProductView/index.js'
import helpers from '../../helpers/index.js';
import './index.scss';

class ResultSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [...props.initList],
            isLoading: false,
            price: { from: 0, to: 0 },
            sortBtnActive: 0,
        };
    }

    // Function to show products
    showProducts = (list) => {
        list = list ? list : [];
        return list.map((product, index) => {
            const { avt, name, discount, price, stock, id, rates } = product;
            return (
                // <Col key={index} span={24} sm={12} lg={8} xl={6} xxl={4}>
                <Col key={index} span={24} sm={12} lg={8} xl={6}>
                    <Link to={`/product/${id}`}>
                        <ProductView
                            name={name}
                            price={price}
                            stock={stock}
                            avtUrl={avt}
                            discount={parseFloat(discount)}
                            rate={rates}
                            height={400}
                        />
                    </Link>
                </Col>
            );
        });
    };

    // Event: Sort products
    onSort = (type = 0) => {
        const { list, sortBtnActive } = this.state;
        if (type) {
            if (type === sortBtnActive) {
                // Reset to initial list
                this.setState({ list: [...this.props.initList], sortBtnActive: 0 });
                return;
            } else {
                // Set loading
                this.setState({ isLoading: true, sortBtnActive: type });
            }

            let newList = [];
            switch (type) {
                // Sort by descending price
                case 1:
                    newList = list.sort((a, b) => b.price - a.price);
                    break;
                // Sort by ascending price
                case 2:
                    newList = list.sort((a, b) => a.price - b.price);
                    break;
                // Best-selling
                case 3:
                    newList = list.sort((a, b) => b.rate - a.rate);
                    break;
                // Best-rated
                case 4:
                    // newList = list.sort((a, b) => helpers.calStar(b.rate) - helpers.calStar(a.rate));
                    newList = list.sort((a, b) => b.rates - a.rates);
                    break;
                // Best discount
                case 5:
                    newList = list.sort((a, b) => b.discount - a.discount);
                    break;
                default:
                    this.setState({ isLoading: false });
                    break;
            }

            // Delay
            setTimeout(() => {
                this.setState({ isLoading: false, list: newList });
            }, 200);
        }
    };

    // Event: Filter by price range
    onFilterByPrice = () => {
        const { initList } = this.props;
        const { price } = this.state;
        this.setState({ isLoading: true });
        let newList = initList.filter(item => item.price >= price.from && item.price <= price.to);
        // Delay
        setTimeout(() => {
            this.setState({ isLoading: false, list: newList });
        }, 200);
    };

    render() {
        const { list, isLoading, price, sortBtnActive } = this.state;
        return (
            <Row className="Result-Search">
                {/* Header: Sort and search button */}
                <Col span={24} className="sort-wrapper">
                    <div className="sort">
                        <span className="title-sapxep">Sắp xếp theo</span>
                        {[1, 2, 3, 4, 5].map((key) => (
                            <Button
                                className={`${key === sortBtnActive ? 'sort-btn-active' : ''} m-4 bor-rad-4`}
                                key={key}
                                size="large"
                                onClick={() => this.onSort(key)}>
                                {['Giá giảm dần', 'Giá tăng dần', 'Bán chạy nhất', 'Đánh giá tốt nhất', 'Khuyến mãi tốt nhất'][key - 1]}
                            </Button>
                        ))}

                        {/* Search price range */}
                        * <div className="price-search">
                            <InputNumber
                                className="price-search-input "
                                size="large"
                                min={0}
                                max={1000000000}
                                placeholder="Giá thấp nhất"
                                step={10000}
                                onChange={(value) => this.setState({ price: { ...price, from: value } })}
                            />
                            {' - '}
                            <InputNumber
                                className="price-search-input"
                                size="large"
                                min={price.from}
                                max={1000000000}
                                placeholder="Giá cao nhất"
                                step={10000}
                                onChange={(value) => this.setState({ price: { ...price, to: value } })}
                            />
                            {price.to > 0 && (
                                <Button
                                    type="primary"
                                    size="large"
                                    className="m-l-8 price-search-btn bor-rad-4"
                                    onClick={this.onFilterByPrice}>
                                    Lọc
                                </Button>
                            )}
                        </div>
                    </div>
                </Col>

                {/* Render list */}
                <Col span={24} className="Result-Search-list p-16">
                    {!list || list.length === 0 ? (
                        <div className="not-found">
                            <img className="not-found-product " src={productNotFoundUrl} alt="No products found" />
                            <span className=" title-not-found">
                                Không sản phẩm nào được tìm thấy
                            </span>
                        </div>
                    ) : isLoading ? (
                        <Spin
                            className="trans-center"
                            tip="Đang cập nhật sản phẩm ..."
                            size="large"
                        />
                    ) : (
                        <Row gutter={[8, 16]}>{this.showProducts(list)}</Row>
                    )}
                </Col>
            </Row>
        );
    }
}

ResultSearch.defaultProps = {
    initList: [],
};

ResultSearch.propTypes = {
    initList: PropTypes.array,
};

export default ResultSearch;

import React, { Component } from 'react';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min.js';
import PropTypes from 'prop-types';
import helpers from '../../../helpers/index.js';
import ProductView from '../../../components/ProductView/index.js';
import './index.scss';

class RelatedProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 1,
            page: 1,
            windowWidth: window.innerWidth,
            isMdDevice: false,
        };
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const windowWidth = window.innerWidth;
        const isMdDevice = windowWidth <= 768;
        this.setState({ windowWidth, isMdDevice });
    };

    paginate = (list) => {
        const { span } = this.props;
        const { windowWidth } = this.state;

        let perPage;
        const windowSize = helpers.convertWidthScreen(windowWidth);
        if (span.hasOwnProperty(windowSize))
            perPage = 24 / span[windowSize];
        else {
            const spanValues = Object.values(span);
            let min = Math.min(...spanValues);
            perPage = 24 / min;
        }

        return list.slice(perPage * (this.state.page - 1), perPage * this.state.page);
    };

    // fn: show list sản phẩm liên quan
    showProductList = (list) => {
        const listSliced = this.paginate(list);
        return listSliced.map((product, index) => {
            const { name, avt, price, discount, stock, id } = product;
            return (
                <Col key={index} {...this.props.span}>
                    <Link to={`/product/${id}`}>
                        <ProductView
                            className={this.state.isMdDevice ? 'm-auto' : ''}
                            name={name}
                            avtUrl={avt}
                            discount={parseFloat(discount)}
                            stock={stock}
                            price={price}
                            height={this.state.isMdDevice ? 380 : 420}
                        />
                    </Link>
                </Col>
            );
        });
    };

    // render
    render() {
        const { list, title } = this.props;
        return (
            <Row
                className="Related-Products bg-white p-16"
                gutter={[16, 8]}
                style={{ borderRadius: 8 }}>
                {title !== '' && (
                    <Col span={24} className="p-8">
                        <h2 className="font-weight-700">{title}</h2>
                        <div className="underline-title"></div>
                    </Col>
                )}

                {/* hiển thị danh sách sản phẩm cùng loại */}
                <Col span={24}>
                    <Row gutter={[16, 16]} className="m-t-16">
                        {this.showProductList(list)}
                    </Row>
                </Col>

                {/* Mũi tên chuyển trang */}
                <div className='arrow-total'>
                    <LeftCircleOutlined
                        className={`arrow arrow-left ${this.state.page <= 1 ? 'disabled' : ''}`}
                        onClick={() => this.setState({ page: this.state.page - 1 })}
                    />
                    <RightCircleOutlined
                        className={`arrow arrow-right ${this.state.page >= Math.ceil(list.length / this.state.perPage) ? 'disabled' : ''}`}
                        onClick={() => this.setState({ page: this.state.page + 1 })}
                    />
                </div>
            </Row>
        );
    }
}

RelatedProductList.defaultProps = {
    list: [],
    title: '',
    span: { span: 24, xs: 24, sm: 12, md: 8, lg: 6, xl: 4, xxl: 4 },
};

RelatedProductList.propTypes = {
    list: PropTypes.array,
    title: PropTypes.string,
    span: PropTypes.object,
};

export default withRouter(RelatedProductList);

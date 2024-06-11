import React, { Component } from 'react';
import { message } from 'antd';
import { getProductType } from '../../../services/productService';
import PropTypes from 'prop-types';
import RelatedProductList from '../../../components/ProductDetail/RelatedProductList';

class RelatedProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productList: [],
        };
    }

    componentDidMount() {
        this.getRelatedProducts();
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.id !== this.props.id ||
            prevProps.type !== this.props.type ||
            prevProps.brand !== this.props.brand
        ) {
            this.getRelatedProducts();
        }
    }

    componentWillUnmount() {
        this.isSubscribed = false;
    }

    // fn: gọi api lấy danh sách sản phẩm cùng type
    async getRelatedProducts() {
        this.isSubscribed = true;
        const { id, type } = this.props;
        try {
            const response = await getProductType(type, id); // BE mặc định chỉ đưa 10 sản phẩm lên
            if (response && this.isSubscribed) {
                this.setState({ productList: response.data });
            } else {
                message.error(response.message, 3);
            }
        } catch (error) {
            console.error('Error fetching related products:', error);
        }
    }

    render() {
        const { productList } = this.state;
        const { title, span } = this.props;
        return (
            <>
                {productList.length > 0 && (
                    <RelatedProductList span={span} list={productList} title={title} />
                )}
            </>
        );
    }
}

RelatedProduct.defaultProps = {
    id: '',
    type: 0,
    brand: '',
    title: '',
    span: { span: 24, xs: 24, sm: 12, md: 8, lg: 6, xl: 4, xxl: 4 },
};

RelatedProduct.propTypes = {
    id: PropTypes.string,
    type: PropTypes.number,
    brand: PropTypes.string,
    title: PropTypes.string,
    span: PropTypes.object,
};

export default RelatedProduct;

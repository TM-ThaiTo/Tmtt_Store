import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { getProductById } from '../../services/productService.js';
import ProductDetail from '../../components/ProductDetail';
import GlobalLoading from '../../components/Loading/Global/index.js';

class ProductDetailPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: null,
            isNotFoundProduct: false,
        };
        this.isComponentMounted = true;
    }

    // event: gọi api lấy chi tiết sản phẩm
    componentDidMount() {
        this.getProduct();
    }

    // fn: update lại giao diện nếu thay dổi đường dẫn
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.getProduct();
        }
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    // fn: hàm gọi api lấy chi tiết sản phẩm
    getProduct = async () => {
        const productId = this.props.match.params.productId;
        const res = await getProductById(productId);
        try {
            if (res && res.code === 0) {
                const data = res.data;
                this.setState({ product: data });
            }
            else {
                this.setState({ isNotFoundProduct: true });
            }
        } catch (error) {
            if (this.isComponentMounted) {
                this.setState({ isNotFoundProduct: true });
            }
        }
    };

    // rendering
    render() {
        const { product, isNotFoundProduct } = this.state;
        return (
            <>
                {product ? (
                    <ProductDetail dataProduct={product} />
                ) : (
                    <GlobalLoading content="Đang tải sản phẩm ..." />
                )}
                {isNotFoundProduct && <Redirect to="/not-found" />}
            </>
        );
    }
}

export default withRouter(ProductDetailPage);

import React, { Component } from 'react';
import { Pagination, Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import { getSearchProductsApi } from '../../../services/productService.js';
import ResultSearch from '../../../components/ResultSearch/index.js';
import helpers from '../../../helpers/index.js';
import ProductCarousel from '../ProductCarousel/index.js';
import './index.scss'

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            page: 1,
            total: 0,
            isLoading: true,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.fetchData();
        }
    }

    // Function to get query parameters from URL
    getQuery = () => {
        const search = this.props.location.search;
        return helpers.queryString(search);
    };

    getSearchProducts = async (currentPage, isSubscribe) => {
        try {
            const query = this.getQuery();
            const keyword = query.find(item => item.hasOwnProperty('keyword'));
            const keywordValue = keyword ? decodeURI(keyword.keyword.replace(/[+]/gi, ' ')) : '';

            const result = await getSearchProductsApi(keywordValue, currentPage, 12);
            if (result && isSubscribe) {
                const data = result.data;
                const total = result.count;
                this.setState({ list: data, total: total, isLoading: false });
            }
        } catch (error) {
            this.setState({ list: [], total: 0, isLoading: false });
        }
    };

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount() {
        this.isSubscribe = false;
    }

    fetchData() {
        let isSubscribe = true;
        this.setState({ isLoading: true });
        const { page } = this.state;
        if (page !== 1) this.setState({ page: 1 });
        this.getSearchProducts(1, isSubscribe);
    }

    handlePageChange = page => {
        let isSubscribe = true;
        this.setState({ isLoading: true, page });
        this.getSearchProducts(page, isSubscribe);
    };

    render() {
        // Lấy dữ liệu từ state
        const { list, page, total, isLoading } = this.state;
        const query = this.getQuery();
        const keyword = query.find(item => item.hasOwnProperty('keyword'));
        const keywordValue = keyword ? decodeURI(keyword.keyword.replace(/[+]/gi, ' ')) : '';

        return (
            <div className="container" style={{ minHeight: '100vh' }}>
                {/* Carousel */}
                <ProductCarousel />

                {/* Number of search results */}
                {!isLoading && (
                    <div className='title-search'>
                        <h2 className="name-search">
                            Tìm được <b>{total}</b> sản phẩm {keywordValue !== '' ? `cho "${keywordValue}"` : ''}
                        </h2>
                    </div>
                )}

                {/* Loading */}
                {isLoading ? (
                    <Spin
                        className="trans-center"
                        tip="Đang tìm kiếm sản phẩm phù hợp ..."
                        size="large"
                    />
                ) : (
                    <>
                        {/* Search result */}
                        <div className='locsanpham'>
                            <ResultSearch initList={list} />
                        </div>

                        {/* Pagination */}
                        {total > 0 && (
                            <div className='pagination'>
                                <Pagination
                                    total={total}
                                    current={page}
                                    showSizeChanger={false}
                                    pageSize={12}
                                    onChange={this.handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }
}

export default withRouter(SearchResult);

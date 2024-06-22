import React, { Component } from 'react';
import { Pagination, Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import { getSearchProductsApi } from '../../../services/productService.js';
import ResultSearch from '../../../components/ResultSearch/index.js';
import helpers from '../../../helpers/index.js';
import ProductCarousel from '../ProductCarousel/index.js';
import './index.scss';

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

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.fetchData();
        }
    }

    componentWillUnmount() {
        this.isSubscribed = false;
    }

    fetchData() {
        const { page } = this.state;
        this.setState({ isLoading: true, page: 1 });
        this.getSearchProducts(1);
    }

    async getSearchProducts(currentPage) {
        try {
            const query = this.getQuery();
            const keyword = query.find(item => item.hasOwnProperty('keyword'));
            const keywordValue = keyword ? decodeURI(keyword.keyword.replace(/[+]/gi, ' ')) : '';

            const result = await getSearchProductsApi(keywordValue, currentPage, 12);
            if (result) {
                const data = result.data;
                const total = result.count;
                this.setState({ list: data, total: total, isLoading: false });
            }
        } catch (error) {
            console.error('Error fetching search products:', error);
            this.setState({ list: [], total: 0, isLoading: false });
        }
    }

    handlePageChange = page => {
        this.setState({ isLoading: true, page });
        this.getSearchProducts(page);
    };

    getQuery = () => {
        const search = this.props.location.search;
        return helpers.queryString(search);
    };

    render() {
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
                    /* Search result */
                    <div className='locsanpham'>
                        {list === null ? (
                            <ResultSearch initList={[]} />
                        ) : (
                            <ResultSearch initList={list} />
                        )}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && list && list.length > 0 && (
                    <div className='pagination'>
                        <Pagination
                            total={total}
                            current={page}
                            pageSize={12}
                            onChange={this.handlePageChange}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(SearchResult);

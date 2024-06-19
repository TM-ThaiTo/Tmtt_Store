import React, { Component } from 'react';
import { Button, Pagination, Spin, message } from 'antd';
import { getFilterProductApi } from '../../../services/productService.js'
import { withRouter } from 'react-router-dom';
import ProductCarousel from '../ProductCarousel';
import ResultSearch from '../../../components/ResultSearch/index.js';
import constants from '../../../constants/index';
import helpers from '../../../helpers/index.js';
import './index.scss';

class FilterResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: decodeURI(this.props.location.search),
            list: [],
            page: 1,
            total: 0,
            isLoading: false,
            perPage: 12,
            tagList: [],
            activeList: [],
            type: 0,
            pOption: "",
            dOption: '',

            // tạo tạm 
            typeTest: 0,

            // data filter
            price: 0,
            brand: '',
            buses: '',
            sizes: '',
            capacities: '',
            types: "",
            displaySizes: "",
            series: "",
            connectionStds: "",
            chipSetes: "",
            sizeStdes: "",
            socketTypes: "",
            capaities: "",
            manufactureres: "",
            isLeds: "",
            colores: "",
            ledColores: "",
            bgPlates: "",
            resolutions: "",
            frequencies: "",
            // connectionStdes: "",
            brandWidth: "",
            strongs: "",
            wattages: "",
            connectionPort: "",
        };
    }

    // event: Lấy dữ liệu tìm kiếm
    getData = async () => {
        // const {
        //     // type,
        //     stringType, price, brand, buses, sizes, capacities, types, displaySizes, series, connectionStds, chipSetes,
        //     sizeStdes, socketTypes, capaities, manufactureres, isLeds, colores, ledColores, bgPlates, resolutions, frequencies,
        //     brandWidth, strongs, wattages, connectionPort, page, perPage, url } = this.state;
        const { stringType, page, perPage, type } = this.state;
        // if (type === null) return;
        // const data = {
        //     type: stringType,
        //     brand: brand,
        //     price: price,
        //     filerTotal: {
        //         buses: buses,
        //         sizes: sizes,
        //         capacities: capacities,
        //         types: types,
        //         displaySizes: displaySizes,
        //         series: series,
        //         connectionStds: connectionStds,
        //         chipSetes: chipSetes,
        //         sizeStdes: sizeStdes,
        //         socketTypes: socketTypes,
        //         capaities: capaities,
        //         manufactureres: manufactureres,
        //         isLeds: isLeds,
        //         colores: colores,
        //         ledColores: ledColores,
        //         bgPlates: bgPlates,
        //         resolutions: resolutions,
        //         frequencies: frequencies,
        //         brandWidth: brandWidth,
        //         strongs: strongs,
        //         wattages: wattages,
        //         connectionPort: connectionPort
        //     }
        // }
        try {
            // const response = await getFilterProductApi(data);
            // if (response && response.code === 0) {
            //     const data = response.data;
            //     this.setState({ list: data, isLoading: false });
            // }
            // else {
            //     this.setState({ isLoading: false });
            //     message.error(response.message);
            // }
            this.setState({ isLoading: true });
            const productList = await getFilterProductApi(
                type,
                page,
                perPage,
            );
            if (productList) {
                const list = productList.data;
                const count = productList.total;
                this.setState({
                    total: count,
                    list: list,
                    isLoading: false,
                });
            }
        }
        catch (error) {
            this.setState({ isLoading: false });
            message.error("Lỗi");
            console.log("check lỗi: ", error);
        }
    }

    // fn: Hàm phân loại type
    classfity = async (sub, query) => {
        const { title, to } = sub;
        if (query === "brand") this.setState({ brand: title })
        if (query === "displaysize") this.setState({ displaySizes: to })
        if (query === "price") this.setState({ price: title })
        if (query === "seri") this.setState({ series: to })
        if (query === "type") this.setState({ types: title })
        if (query === "capacity") this.setState({ capacities: title })
        if (query === "connectionStd") this.setState({ connectionStds: title })
        if (query === "size") this.setState({ sizes: title })
        if (query === "bus") this.setState({ buses: title })
        if (query === "bgPlate") this.setState({ bgPlates: title })
        if (query === "resolution") this.setState({ resolutions: title })
        if (query === "frequence") this.setState({ frequencies: title })
        if (query === "manufacturer") this.setState({ manufactureres: title })
        if (query === "isLed") this.setState({ isLeds: title })
        if (query === "color") this.setState({ colores: title })
        if (query === "ledColor") this.setState({ ledColores: title })
        if (query === "brandWidth") this.setState({ brandWidth: title })
        if (query === "strongs") this.setState({ strongs: title })
        if (query === "wattage") this.setState({ wattages: title })
        if (query === "chipset") this.setState({ chipSetes: title })
        if (query === "sizeStd") this.setState({ sizeStdes: title })
        if (query === "socket") this.setState({ socketTypes: title })
        // if (query === "seri") this.setState({ series: title })
        console.log("check title: ", title, "check to: ", to, " check query: ", query);
    }

    // event: Chọn 1 btn trong bộ lọc
    onChecked = async (sub, query, key) => {
        await this.classfity(sub, query);
        this.getData();
    }

    // fn: hiển thị bộ lọc
    renderFilterOption(type) {
        if (type < 0) return;
        const list = constants.FILTER_OPTION_LIST.find((item) => item.key === type)
            .data;
        return (
            list &&
            list.map((item, index) => (
                <div key={index} className="Filter-Options-item m-tb-14">
                    <h3 className="Filter-Options-item-title">{item.title}</h3>
                    <div>
                        {item.subFilters.map((sub, i) => {
                            let key = index.toString() + i.toString();
                            return (
                                <Button
                                    key={key}
                                    className={`btn-chon  ${this.state.activeList.findIndex((value) => value === key) === -1
                                        ? ''
                                        : 'filter-active-btn'
                                        }`}
                                    onClick={() => this.onChecked(sub, item.query, key)}>
                                    {sub.title}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            ))
        );
    }

    // fn: hiển thị tag đang chọn lọc
    // showTagList() {
    //     const { tagList } = this.state; // Lấy tagList từ state
    //     return (
    //         tagList &&
    //         tagList.map((item, index) => (
    //             <Tag
    //                 className="bor-rad-4"
    //                 key={index}
    //                 closable={true}
    //                 color={item.color}
    //                 onClose={() => this.onCloseTag(item.key, item.query, item.to)}>
    //                 {item.title}
    //             </Tag>
    //         ))
    //     );
    // }

    // event: khởi chạy đầu tiên
    componentDidMount() {
        const { url } = this.state;
        const search = helpers.replaceMongoKeyword(url);
        const queryStrList = helpers.queryString(search);
        let type = 0;
        queryStrList.filter((item) => {
            //  type
            if (Object.keys(item)[0] === 't') {
                if (isNaN(parseInt(item.t))) type = 0;
                else type = parseInt(item.t);
                return false;
            }
            return true;
        });
        const typeString = helpers.changeTypeIntToString(type);
        this.setState({
            type: type,
            stringType: typeString,
        }, () => {
            this.getData();
        });

    }

    // event: render liên tục
    componentDidUpdate(prevProps, prevState) {
        if (prevState.url !== this.state.url || prevState.page !== this.state.page) {
            this.getData();
        }
    }

    // fn: render
    render() {
        // const { url, list, total, isLoading, tagList, page, perPage, type } = this.state;
        const { list, total, isLoading, page, perPage } = this.state;

        return (
            <div className="container" style={{ minHeight: '100vh' }}>
                <div className='Filer-Content'>
                    {/* Carousel */}
                    <ProductCarousel />

                    {/* Số  kết quả tìm kiếm */}
                    {!isLoading && (
                        <h2 className="font-size-24px m-b-12">
                            Tìm được <b>{total}</b> sản phẩm
                        </h2>
                    )}

                    {/* loading */}
                    {isLoading ? (
                        <Spin
                            className="trans-center"
                            tip="Đang tìm kiếm sản phẩm phù hợp ..."
                            size="large"
                        />
                    ) : (
                        <>
                            {/* Bộ lọc  */}
                            {/* <div className="Filter-Options p-tb-16 bg-white bor-rad-8 box-sha-home">
                                <div className="list-active p-lr-16 p-b-8 d-flex justify-content-between">
                                    <b className="font-size-22px filter-list m-r-20">Bộ lọc</b>
                                    {tagList.length > 0 && (
                                        <>
                                            <div className="d-flex align-i-center flex-wrap">
                                                {this.showTagList()}
                                            </div>
                                            <Button
                                                className="bor-rad-4"
                                                type="dashed"
                                                danger
                                                onClick={this.onCloseAll.bind(this)}>
                                                <b>Xoá tất cả</b>
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <div className="p-lr-16 p-t-16">{this.renderFilterOption(type)}</div>
                            </div> */}

                            {/* Kết quả lọc, tìm kiếm */}
                            <ResultSearch initList={list} />

                            {/* pagination */}
                            {total > 0 && (
                                <Pagination
                                    className="pagination"
                                    total={total}
                                    current={page}
                                    showSizeChanger={false}
                                    pageSize={perPage}
                                    onChange={(p) => this.setState({ page: p })}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(FilterResult);

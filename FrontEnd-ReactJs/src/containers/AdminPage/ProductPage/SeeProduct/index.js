import React, { Component } from 'react';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { message, Spin, Table, Tooltip, Modal, Select, Input, Button } from 'antd';
import { getAPIProductList, getProductToPageAdmin } from "../../../../services/productService";
import { deleteProductApi } from '../../../../services/adminService';
import { exportToExcel } from '../../../../utils/exportFile';
import constants from '../../../../constants';
import EditProductModal from './EditProductModal';
import './index.scss';

class SeeProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editModal: { visible: false, product: null },
            modalDel: { visible: false, id_product: '' },
            isLoading: false,
            setIsLoading: false,
            list: [],
            setList: [],

            isTypeSelected: false,
            selectedProductType: null,
            inputValueMaSanPham: '',
            inputValueNameSanPham: '',
            typeString: '',
        };
        this.isSubscribe = true;
        this.setEditModal = this.setEditModal.bind(this);
    }

    // Event: get all products
    componentDidMount = () => {
        this.getProductList();
    }
    componentWillUnmount() {
        this.isSubscribe = false;
    }

    //#region Danh sách sản phẩm
    // fn: Cột của bảng
    columns = [
        {
            title: 'Mã',
            key: 'code',
            dataIndex: 'code',
            render: (code, data) => (
                <a target="blank" href={`/product/${data.id_product}`}>
                    {code}
                </a>
            ),
        }, // mã sản phẩm
        {
            title: 'Tên',
            key: 'name',
            dataIndex: 'name',
            render: (name) => (
                <Tooltip title={name}>{this.reduceProductName(name, 40)}</Tooltip>
            ),
        }, // tên sản phẩm
        {
            title: 'Giá',
            key: 'price',
            dataIndex: 'price',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.price - b.price,
            render: (price) => (
                <h5 style={{ color: '#4F55C5' }}>
                    {price ? this.formatProductPrice(price) : 'Liên hệ'}
                </h5>
            ),
        }, // giá
        {
            title: 'Loại',
            key: 'type',
            dataIndex: 'type',
        }, // loại sản phẩm
        {
            title: 'Thương hiệu',
            key: 'brand',
            dataIndex: 'brand',
            sorter: (a, b) => {
                if (a.brand < b.brand) return -1;
                if (a.brand > b.brand) return 1;
                return 0;
            },
            render: (brand) => (
                <Tooltip title={brand}>{this.reduceProductName(brand, 40)}</Tooltip>
            ),
        }, // thương hiệu
        {
            title: 'Tồn kho',
            key: 'stock',
            dataIndex: 'stock',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.stock - b.stock,
        }, // tồn kho
        {
            title: 'Mức giảm giá',
            key: 'discount',
            dataIndex: 'discount',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.discount - b.discount,
            render: (discount) => `${discount} %`,
        }, // giảm giá
        {
            title: 'Đánh giá',
            key: 'rate',
            dataIndex: 'rate',
            // render: (rate) => this.calStar(rate).toFixed(1),
        }, // đánh giá
        {
            title: 'Hành động',
            key: 'actions',
            fixed: 'right',
            width: 100,
            render: (text) => (
                <>
                    {/* xoá sản phẩm */}
                    <DeleteOutlined
                        onClick={() => this.showDeleteConfirmation(text.id_product)}
                        className="m-r-8 action-btn-product"
                        style={{ color: 'red' }}
                    />
                    {/* update sản phẩm */}
                    <Tooltip title="Chỉnh sửa" placement="left">
                        <EditOutlined
                            onClick={() => {
                                this.setEditModal({ visible: true, product: { ...text } });
                            }}
                            className="m-r-8 action-btn-product"
                            style={{ color: '#444' }}
                        />
                    </Tooltip>

                    {/* xem chi tiết */}
                    <Tooltip title="Xem chi tiết" placement="left">
                        <a target="blank" href={`/product/${text.id_product}`}>
                            <EyeOutlined
                                className="action-btn-product"
                                style={{ color: '#444' }}
                            />
                        </a>
                    </Tooltip>
                </>
            ),
        }, // chức năng
    ];

    // fn: modal edit 
    setEditModal = (modalData) => {
        this.setState({
            editModal: {
                ...this.state.editModal,
                ...modalData,
            },
        });
    }

    // fn: hàm rút gọn tên sản phẩm
    reduceProductName = (name, length = 64) => {
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

    // fn: tính tỉ lệ sao của sản phẩm [1,2,3,4,5]
    calStar = (rates) => {
        const total = rates.reduce((a, b) => a + b, 0);
        if (total === 0) return 0;
        let rateTotal = 0;
        for (let i = 0; i < 5; ++i) {
            rateTotal += rates[i] * (i + 1);
        }
        return rateTotal / total;
    };

    // fn: Lấy danh sách Product
    getProductList = async () => {
        try {
            this.setState({ isLoading: true });
            const response = await getAPIProductList();
            if (response && response.data && response.code === 0) {
                const data = response.data;
                const newList = data.map((item) => {
                    return {
                        id_product: item.id_product,
                        code: item.code,
                        name: item.name,
                        type: item.type,
                        price: item.price,
                        brand: item.brand,
                        stock: item.stock,
                        discount: item.discount,
                        rate: item.rate,
                    };
                });
                this.setState({ list: newList, isLoading: false });
            } else {
                message.error('Lấy danh sách Sản phẩm thất bại');
                this.setState({ isLoading: false });
            }
        } catch (error) {
            if (this.isSubscribe) {
                this.setState({ isLoading: false });
                console.log("check error: ", error, this.isSubscribe);
                message.error('Lỗi try-catch lấy sản phẩm.');
            }
        }
    }

    // fn: Hàm xác nhận xoá to handle the delete confirmation
    showDeleteConfirmation = (productId) => {
        Modal.confirm({
            title: 'Xác nhận xoá',
            content: 'Bạn có chắc chắn muốn xoá sản phẩm này?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => this.onDelete(productId),
            onCancel: () => message.info('Đã hủy xoá sản phẩm'),
        });
    };

    // Event: delete product
    onDelete = async (_id) => {
        try {
            const response = await deleteProductApi(_id);
            if (response && response.code === 0) {
                message.success('Xoá thành công.');
                this.getProductList();
                const newList = this.state.list.filter((item) => item._id !== _id);
                this.setState({ list: newList });
            }
        } catch (error) {
            message.error('Xoá thất bại, thử lại !');
        }
    };

    // Event: close edit modal
    onCloseEditModal = (newProduct) => {
        const newList = this.state.list.map((item) =>
            item.id_product !== newProduct.id_product ? item : { ...item, ...newProduct },
        );
        this.setState({
            list: newList,
            editModal: { visible: false }
        });
    };
    //#endregion

    //#region Tìm kiếm sản phẩm
    // event: chọn type sản phẩm
    onProductTypeChange = (value) => {
        const selectedProduct = constants.PRODUCT_TYPES.find(item => item.type === value);
        if (selectedProduct) {
            if (!this.state.isTypeSelected) {
                this.setState({ isTypeSelected: true });
            }
            this.setState({
                typeString: selectedProduct.typeString,
            });
        }
    };

    // event: cập nhâtk giá trị mã sản phẩm
    handleInputChangMaSP = (e) => {
        this.setState({
            inputValueMaSanPham: e.target.value,
        });
    };

    // event: cập nhật giá trị tên sản phẩm
    handleInputChangeNameSP = (e) => {
        this.setState({
            inputValueNameSanPham: e.target.value,
        });
    };

    // event: reset Search
    onResetSearch = () => {
        this.setState({
            inputValueMaSanPham: '',
            inputValueNameSanPham: '',
            typeString: null,
        });
        this.getProductList();
    }

    // event: xác nhận tìm kiếm
    onSubmitSearch = async () => {
        const { inputValueMaSanPham, inputValueNameSanPham, typeString } = this.state;
        if (!inputValueMaSanPham && !inputValueNameSanPham && !typeString) return;

        this.setState({ isLoading: true });
        try {
            const response = await getProductToPageAdmin(inputValueMaSanPham, inputValueNameSanPham, typeString);
            if (response && response.data && response.code === 0) {
                const data = response.data;
                const newList = data.map((item) => {
                    return {
                        id_product: item.id_product,
                        code: item.code,
                        name: item.name,
                        type: item.type,
                        price: item.price,
                        brand: item.brand,
                        stock: item.stock,
                        discount: item.discount,
                        rate: item.rate,
                    };
                });
                this.setState({ list: newList, isLoading: false });
            }
            else {
                message.error(response.message);
                this.setState({ isLoading: false });
                this.onResetSearch();
            }
        }
        catch (error) {
            console.log("Lỗi yêu cầu: ", error);
            this.setState({ isLoading: false });
        }
    }
    //#endregion

    //#region Xuất file
    // fn: Xuất dữ liệu ra file excel
    exportToExcel = async () => {
        try {
            const response = await getAPIProductList();
            if (response && response.data && response.code === 0) {
                const data = response.data;
                if (data && data.length > 0) {
                    const newList = data.map((item) => {
                        return {
                            id_product: item.id_product,
                            code: item.code,
                            name: item.name,
                            type: item.type,
                            price: item.price,
                            brand: item.brand,
                            stock: item.stock,
                            discount: item.discount,
                            rate: item.rate,
                        };
                    });
                    const dataE = newList;
                    await exportToExcel(dataE, "Danh sách sản phẩm", "ListProducts");
                } else {
                    message.error("Không có sản phẩm để xuất file");
                }
            }
            else {
                message.error('Lấy danh sách sản phẩm thất bại');
            }
        }
        catch (error) {
            message.error('Lấy danh sách sản phẩm thất bại');
        }
    }
    //#endregion

    // fn: rendering
    render() {
        const { list, isLoading } = this.state;
        const { visible, product } = this.state.editModal;

        return (
            <>
                {/* chức năng */}
                <div className='search-product-admin container'>
                    <div>
                        <Input
                            className='inputValue-code'
                            placeholder='Nhập mã sản phẩm'
                            value={this.state.inputValueMaSanPham}
                            onChange={this.handleInputChangMaSP}
                        />
                        <Input
                            className='inputValue-name'
                            placeholder='Nhập tên sản phẩm sản phẩm'
                            value={this.state.inputValueNameSanPham}
                            onChange={this.handleInputChangeNameSP}
                        />
                        <Select
                            className="selectType"
                            size="large"
                            onChange={this.onProductTypeChange}
                            placeholder="Chọn loại sản phẩm *"
                        >
                            {constants.PRODUCT_TYPES.map((item, index) => (
                                <Select.Option value={item.type} key={index}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <Button
                            type="primary"
                            className='btn_search'
                            onClick={this.onSubmitSearch}
                        >
                            Tìm kiếm
                        </Button>
                        <Button
                            danger
                            type="primary"
                            className='btn-reset'
                            style={{ backgroundColor: 'yellow', borderColor: 'yellow', color: 'black' }}
                            onClick={this.onResetSearch}
                        >
                            Làm mới
                        </Button>
                        <Button
                            type="primary"
                            className='btn-reset'
                            style={{ backgroundColor: 'green', borderColor: 'green' }}
                            onClick={this.exportToExcel}
                        >
                            Xuất Excel
                        </Button>
                    </div>
                </div>

                {/* Giao diện hiển thị sản phẩm */}
                <div className="pos-relative p-8">
                    {isLoading ? (
                        <Spin
                            tip="Đang tải danh sách sản phẩm ..."
                            size="large"
                            className="trans-center"
                        />
                    ) : (
                        <>
                            {/* Rest of your code */}
                            <Table
                                pagination={{
                                    position: ['bottomCenter'],
                                    showLessItems: true,
                                }}
                                className="admin-see-product"
                                columns={this.columns}
                                dataSource={list} // Updated this line
                            />

                            {/* edit product modal */}
                            <EditProductModal
                                visible={visible}
                                onClose={(value) => this.onCloseEditModal(value)}
                                product={product}
                            />
                        </>
                    )}
                </div>
            </>
        );
    }
}

export default SeeProduct;

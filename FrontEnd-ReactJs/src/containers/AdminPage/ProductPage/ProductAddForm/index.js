import React, { Component } from 'react';
import { ExclamationCircleOutlined, InfoCircleOutlined, UploadOutlined, } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Tooltip, Upload, } from 'antd';
import { connect } from 'react-redux';
import Compressor from 'compressorjs';
import constants from '../../../../constants/index.js';
// các component
import Disk from './Disk/index.js';
import Display from './Display/index.js';
import Headphone from './Headphone/index.js';
import Keyboard from './Keyboard/index.js';
import Laptop from './Laptop/index.js';
import MainBoard from './Mainboard/index.js';
import Monitor from './Monitor/index.js';
import Mouse from './Mouse/index.js';
import ProductDesc from './ProductDetailModal/index.js';
import Ram from './Ram/index.js';
import Router from './Router/index.js';
import Speaker from './Speaker/index.js';
// add api
import { postAddProduct } from '../../../../services/adminService.js';
const suffixColor = '#aaa';

class ProductAddForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            isTypeSelected: false,
            // lưu trữ loại sản phẩm
            typeSelected: -1,
            typeString: "",
            productDecs: null,
            infoDetail: "",
            avtBase64: null,
            fileList: [],
            fileCompressedList: [],
            avtFileList: [],
        };

        this.formRef = React.createRef();
        this.setAvtFileList = this.setAvtFileList.bind(this);
    };

    setAvtFileList(fileList) {
        this.setState({ avtFileList: fileList });
    }

    // render giao diện thêm chi tiết sản phẩm
    onRenderProduct = (value) => {
        switch (value) {
            case 0:
                return <Ram />;
            case 1:
                return <Disk />;
            case 2:
                return <Laptop />;
            case 3:
                return <Display />;
            case 4:
                return <MainBoard />;
            case 5:
                return <Headphone />;
            case 6:
                return <Keyboard />;
            case 7:
                return <Monitor />;
            case 8:
                return <Mouse />;
            case 9:
                return <Router />;
            case 10:
                return <Speaker />;
            default:
                break;
        }
    };

    // render file
    onCompressFile = async (file, type = 0) => {
        try {
            const compressedFile = await new Promise((resolve, reject) => {
                new Compressor(file, {
                    quality: 0.6,
                    convertSize: 2000000,
                    success: (fileCompressed) => resolve(fileCompressed),
                    error: (err) => reject(err),
                });
            });

            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onloadend = async () => {
                if (type === 0) {
                    this.setState({ avtBase64: reader.result });
                } else {
                    const { fileCompressedList } = this.state; // Assuming fileCompressedList is in the component state
                    if (fileCompressedList.length < 10) {
                        this.setState({
                            fileCompressedList: [
                                ...fileCompressedList,
                                {
                                    data: reader.result,
                                    uid: file.uid,
                                },
                            ],
                        });
                    }
                }
            };
        } catch (error) {
            message.error('Lỗi: ', error);
        }
    }

    // chuyển dữ liệu và tìm typeString
    onProductTypeChange = (value) => {
        const selectedProduct = constants.PRODUCT_TYPES.find(item => item.type === value);

        if (selectedProduct) {
            if (!this.state.isTypeSelected) {
                this.setState({ isTypeSelected: true });
            }

            this.setState({
                typeSelected: value,
                infoDetail: selectedProduct.info,
                typeString: selectedProduct.typeString,
            });
        }
    };

    // chuyền dữ liệu và lấy dữ liệu từ modal cho Desc
    onGetDetailDesc = (data) => {
        this.setState({ productDecs: data });
    };

    // reset form
    onResetForm = () => {
        this.formRef.current.resetFields();
        this.fileCompressedList = [];
        this.setState({
            avtFileList: [],
            avtBase64: null,
            fileList: [],
        });
    };

    // kiểm tra thông tin nhập
    onValBeforeSubmit = async (data) => {
        try {
            if (!this.state.avtBase64) {
                message.error('Thêm avatar !', 2);
                return;
            }
            if (this.state.productDecs === null) {
                Modal.confirm({
                    title: 'Bạn có chắc muốn submit ?',
                    content: 'Chưa có BÀI VIẾT MÔ TẢ cho sản phẩm này !',
                    icon: <ExclamationCircleOutlined />,
                    okButtonProps: true,
                    onCancel: () => { },
                    onOk: () => {
                        this.onSubmit(data);
                    },
                });
            } else if (this.state.fileCompressedList.length === 0) {
                Modal.confirm({
                    title: 'Bạn có chắc muốn submit ?',
                    content: 'Chưa có HÌNH ẢNH MÔ TẢ cho sản phẩm này !',
                    icon: <ExclamationCircleOutlined />,
                    okButtonProps: true,
                    onCancel: () => { },
                    onOk: () => {
                        this.onSubmit(data);
                    },
                });
            } else {
                this.onSubmit(data);
            }
        } catch (error) {
            console.log("check error: ", error);
            message.error('Có lỗi. Thử lại !');
        }
    };

    // fn: nút xác nhận và gửi api thêm sản phẩm
    onSubmit = async (data) => {
        try {
            this.setState({ isSubmitting: true });
            const {
                code,
                name,
                price,
                discount,
                stock,
                brand,
                otherInfo,
                ...rest // tổng hợp prvDetails
            } = data;
            const discountAsString = discount.toString();

            // tổng hợp product
            const product = {
                type: this.state.typeString,
                discount: discountAsString,
                code,
                name,
                price,
                brand,
                stock,
                otherInfo,
                avtBase64: this.state.avtBase64,
            };

            // Move this declaration before using it in the details object
            const catalogs = this.state.fileCompressedList.map((item) => item.data);

            // tổng hợp detail (shareDetails, prvDetails)
            const { capacity, processorCount, weight, frequency, wattage, strong,
                warranty,
                ...prvDetailsWithoutWarranty } = rest;

            const details = {
                shareDetails: {
                    catalogs: catalogs,
                    warranty: warranty.toString(),
                },
                prvDetails: {
                    [this.state.infoDetail]: {
                        // disk
                        ...(capacity && { capacity: capacity.toString() }),
                        //laptop
                        ...(processorCount && { processorCount: processorCount.toString() }),
                        ...(weight && { weight: weight.toString() }),
                        // màn hinh
                        ...(frequency && { frequency: frequency.toString() }),
                        // speaker
                        ...(wattage && { wattage: wattage.toString() }),
                        // router wifi
                        ...(strong && { strong: strong.toString() }),

                        ...prvDetailsWithoutWarranty,
                    }
                },
            };
            const dataSend = { product, details, desc: this.state.productDecs };

            // gửi api
            const response = await postAddProduct(dataSend);
            if (response.code === 0) {
                this.setState({ isSubmitting: false });
                message.success('Thêm sản phẩm thành công');
            }
            else {
                message.warning(response.message, 3);
                this.setState({ isSubmitting: false });
            }
        }
        catch (error) {
            this.setState({ isSubmitting: false });
            if (error.response) {
                message.error(error.response.data.message);
                this.onResetForm();
            } else {
                message.error('Thêm sản phẩm thất bại. Thử lại');
            }
        }
    };

    render() {
        // const { isTypeSelected, avtFileList, fileList, isSubmitting, infoDetail } = this.state;
        const { isTypeSelected, avtFileList, fileList, isSubmitting } = this.state;

        return (
            <div className="Admin-Product-Page">
                <h1 className="t-center p-t-20">
                    <b>Thêm sản phẩm</b>
                </h1>
                <Select
                    className="m-l-20"
                    size="large"
                    style={{ width: 250 }}
                    onChange={this.onProductTypeChange}
                    placeholder="Chọn loại sản phẩm *">
                    {constants.PRODUCT_TYPES.map((item, index) => (
                        <Select.Option value={item.type} key={index}>
                            {item.label}
                        </Select.Option>
                    ))}
                </Select>
                {isTypeSelected && (
                    <div className="p-20">
                        <Form
                            name="form"
                            ref={this.formRef}
                            onFinish={this.onValBeforeSubmit}
                            onFinishFailed={() => message.error('Lỗi. Kiểm tra lại form')}>

                            {/* các thông số cơ bản */}
                            <Row gutter={[16, 16]}>
                                {/*  tổng quan một sản phẩm */}
                                <Col span={24}>
                                    <h2>Thông tin cơ bản sản phẩm</h2>
                                </Col>
                                {/* mã sản phẩm */}
                                <Col span={12} md={8} xl={6} xxl={4}>
                                    <Form.Item
                                        name="code"
                                        rules={[
                                            { required: true, message: 'Bắt buộc', whitespace: true },
                                        ]}>
                                        <Input
                                            size="large"
                                            placeholder="Mã sản phẩm *"
                                            suffix={
                                                <Tooltip title="SKU200500854">
                                                    <InfoCircleOutlined style={{ color: suffixColor }} />
                                                </Tooltip>
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                {/* tên sản phẩm */}
                                <Col span={12} md={8} xl={6} xxl={4}>
                                    <Form.Item
                                        name="name"
                                        rules={[
                                            { required: true, message: 'Bắt buộc', whitespace: true },
                                        ]}>
                                        <Input
                                            size="large"
                                            placeholder="Tên sản phẩm *"
                                            suffix={
                                                <Tooltip title="Laptop Apple MacBook Air 13 2019 MVFM2SA/A (Core i5/8GB/128GB SSD/UHD 617/macOS/1.3 kg)">
                                                    <InfoCircleOutlined style={{ color: suffixColor }} />
                                                </Tooltip>
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                {/* giá sản phẩm */}
                                <Col span={12} md={8} xl={6} xxl={4}>
                                    <Form.Item
                                        name="price"
                                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            step={10000}
                                            size="large"
                                            placeholder="Giá *"
                                            min={0}
                                            max={1000000000}
                                        />
                                    </Form.Item>
                                </Col>
                                {/* số hang tồn kho */}
                                <Col span={12} md={8} xl={6} xxl={4}>
                                    <Form.Item
                                        name="stock"
                                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            step={5}
                                            size="large"
                                            min={0}
                                            max={100000}
                                            placeholder="Số lượng hàng tồn kho *"
                                        />
                                    </Form.Item>
                                </Col>
                                {/* thương hiệu */}
                                <Col span={12} md={8} xl={6} xxl={4}>
                                    <Form.Item
                                        name="brand"
                                        rules={[
                                            { required: true, message: 'Bắt buộc', whitespace: true },
                                        ]}>
                                        <Input
                                            size="large"
                                            placeholder="Thương hiệu *"
                                            suffix={
                                                <Tooltip title="Apple">
                                                    <InfoCircleOutlined style={{ color: suffixColor }} />
                                                </Tooltip>
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                {/*Thời gian bảo hành*/}
                                <Col span={12} md={8} xl={6} xxl={4}>
                                    <Form.Item
                                        name="warranty"
                                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            step={6}
                                            size="large"
                                            min={0}
                                            max={240}
                                            placeholder="Tg bảo hành (Theo tháng) *"
                                        />
                                    </Form.Item>
                                </Col>
                                {/*Mức giảm giá*/}
                                <Col span={12} md={8} xl={6} xxl={4}>
                                    <Form.Item
                                        name="discount"
                                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            step={10}
                                            size="large"
                                            min={0}
                                            max={30}
                                            placeholder="phần trăm khuyến mãi (5%) *"
                                        />
                                    </Form.Item>
                                </Col>
                                {/* avatar */}
                                <Col span={12} md={8} xl={6} xxl={4}>
                                    <Upload
                                        listType="picture"
                                        fileList={avtFileList}
                                        onChange={({ fileList }) => {
                                            if (avtFileList.length < 1) this.setAvtFileList(fileList);
                                        }}
                                        onRemove={() => {
                                            this.setAvatar(null);
                                            this.setAvtFileList([]);
                                        }}
                                        beforeUpload={(file) => {
                                            this.onCompressFile(file, 0);
                                            return false;
                                        }}>
                                        <Button
                                            disabled={this.state.avtBase64 !== null ? true : false}
                                            className="w-100 h-100"
                                            icon={<UploadOutlined />}>
                                            Upload Avatar
                                        </Button>
                                    </Upload>
                                </Col>
                                {/* mô tả chi tiết */}
                                <ProductDesc onGetDetailDesc={this.onGetDetailDesc} />
                                {/* ... (other form items) ... */}
                                <Col span={24}>
                                    <h2 className="m-b-10">
                                        Thông tin chi tiết cho&nbsp;
                                        <b>{constants.PRODUCT_TYPES[this.state.typeSelected].label}</b>
                                    </h2>
                                    {this.onRenderProduct(this.state.typeSelected)}
                                </Col>
                                {/* ... (other form items) ... */}
                                <Col span={24}>
                                    <h2 className="m-b-10">
                                        Hình ảnh của sản phẩm (Tối đa 10 sản phẩm)
                                    </h2>
                                    <Upload
                                        listType="picture-card"
                                        multiple={true}
                                        onRemove={(file) => {
                                            this.fileCompressedList = this.fileCompressedList.filter(
                                                (item) => item.uid !== file.uid,
                                            );
                                        }}
                                        fileList={fileList}
                                        onChange={({ fileList }) => this.setState({ fileList })}
                                        beforeUpload={(file) => {
                                            this.onCompressFile(file, 1);
                                            return false;
                                        }}>
                                        {fileList.length < 10 && '+ Thêm ảnh'}
                                    </Upload>
                                </Col>
                                {/* ... btn reset and add ... */}
                                <Col span={24} className="d-flex justify-content-end">
                                    <Button
                                        className="m-r-20"
                                        size="large"
                                        danger
                                        type="primary"
                                        onClick={this.onResetForm}>
                                        Reset Form
                                    </Button>
                                    <Button
                                        loading={isSubmitting}
                                        size="large"
                                        type="primary"
                                        htmlType="submit">
                                        Thêm sản phẩm
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductAddForm);

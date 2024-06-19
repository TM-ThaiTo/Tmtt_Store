import React, { Component } from 'react';
import {
    Col,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Row,
    Select,
} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { putUpdateProductApi } from '../../../../../services/adminService.js';

class EditProductModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUpdating: false,
        };
    }

    // fn: loại sản phẩm
    PRODUCT_TYPES = [
        { type: 0, label: 'RAM', info: "infoRam", typeString: "ram" },
        { type: 1, label: 'Ổ cứng', info: "infoDisk", typeString: "disk" },
        { type: 2, label: 'Laptop', info: "infoLaptop", typeString: "laptop" },
        { type: 3, label: 'Card màn hình', info: "infoDisplay", typeString: "display" },
        { type: 4, label: 'Main board', info: "infoMainboard", typeString: "mainboard" },
        { type: 5, label: 'Tai nghe', info: "infoHeadphone", typeString: "headphone" },
        { type: 6, label: 'Bàn phím', info: "infoKeyboard", typeString: "keyboard" },
        { type: 7, label: 'Màn hình', info: "infoMonitor", typeString: "monitor" },
        { type: 8, label: 'Chuột', info: "infoMouse", typeString: "mouse" },
        { type: 9, label: 'Router Wifi', info: "infoRouter", typeString: "router" },
        { type: 10, label: 'Loa', info: "infoSpeaker", typeString: "speaker" },
    ];

    // event: Sửa chữa sản phẩm
    onEdit = async (values) => {
        const { onClose } = this.props;
        try {
            this.setState({ isUpdating: true });

            const discount = values.discount.toString();

            const newData = {
                ...values,
                discount: discount
            };
            const res = await putUpdateProductApi(newData);
            if (res && res.code === 0) {
                setTimeout(() => {
                    message.success('Cập nhật thành công');
                    onClose(values);
                }, 1000);
            } else {
                message.error(res.message, 3);
                onClose(values);
            }
            this.setState({ isUpdating: false });
        } catch (error) {
            message.error('Cập nhật thất bại');
        }
    };

    render() {// JSX
        const { visible, onClose, product } = this.props;
        const { id, code, name, brand, discount, price, stock, type } =
            product || {};
        const initValues = { id, code, name, brand, discount, price, stock, type };
        return (
            <Modal
                className="edit-product-modal"
                destroyOnClose={true}
                maskClosable={false}
                visible={visible}
                okText="Cập nhật"
                cancelText="Huỷ bỏ"
                onCancel={onClose}
                okButtonProps={{ form: 'editForm', htmlType: 'submit' }}
                title="Chỉnh sửa thông tin sản phẩm"
                confirmLoading={this.state.isUpdating}
                width={1000}
                centered>
                <Form
                    initialValues={initValues}
                    name="editForm"
                    onFinish={(value) => this.onEdit(value)}>
                    <Row gutter={[16, 16]}>
                        {/* Id */}
                        <Col span={12}>
                            <p>ID</p>
                            <Form.Item name="id">
                                <Input disabled size="large" placeholder="ID" />
                            </Form.Item>
                        </Col>

                        {/* Mã sản phẩm */}
                        <Col span={12}>
                            <p>Mã sản phẩm</p>
                            <Form.Item
                                name="code"
                                rules={[
                                    { required: true, message: 'Bắt buộc', whitespace: true },
                                ]}>
                                <Input size="large" placeholder="Mã sản phẩm *" />
                            </Form.Item>
                        </Col>

                        {/* Tên sản phẩm */}
                        <Col span={12}>
                            <p>Tên sản phẩm</p>
                            <Form.Item
                                name="name"
                                rules={[
                                    { required: true, message: 'Bắt buộc', whitespace: true },
                                ]}>
                                <Input size="large" placeholder="Tên sản phẩm *" />
                            </Form.Item>
                        </Col>

                        {/* Giá sản phẩm */}
                        <Col span={12}>
                            <p>Giá sản phảm</p>
                            <Form.Item
                                name="price"
                                rules={[{ required: true, message: 'Bắt buộc' }]}>
                                <InputNumber
                                    min={0}
                                    max={9000000000}
                                    step={100000}
                                    className="w-100"
                                    size="large"
                                    placeholder="Giá sản phẩm *"
                                />
                            </Form.Item>
                        </Col>

                        {/* Loại sản phẩm */}
                        <Col span={12}>
                            <p>Loại sản phẩm</p>
                            <Form.Item
                                name="type"
                                rules={[{ required: true, message: 'Bắt buộc' }]}>
                                <Select size="large" placeholder="Loại sản phẩm *">
                                    {this.PRODUCT_TYPES.map((item, index) => (
                                        <Select.Option value={item.type} key={index}>
                                            {item.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* Thương hiệu */}
                        <Col span={12}>
                            <p>Thương hiệu</p>
                            <Form.Item
                                name="brand"
                                rules={[
                                    { required: true, message: 'Bắt buộc', whitespace: true },
                                ]}>
                                <Input size="large" placeholder="Thương hiệu *" />
                            </Form.Item>
                        </Col>

                        {/* Tồn kho */}
                        <Col span={12}>
                            <p>Tồn kho</p>
                            <Form.Item
                                name="stock"
                                rules={[{ required: true, message: 'Bắt buộc' }]}>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    step={1}
                                    size="large"
                                    min={0}
                                    max={100000}
                                    placeholder="Tồn kho *"
                                />
                            </Form.Item>
                        </Col>

                        {/* Mức giảm giá */}
                        <Col span={12}>
                            <p>Mức giảm giá</p>
                            <Form.Item
                                name="discount"
                                rules={[{ required: true, message: 'Bắt buộc' }]}>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    step={1}
                                    size="large"
                                    min={0}
                                    max={100}
                                    placeholder="Mức giảm giá *"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

EditProductModal.propTypes = {
    onClose: PropTypes.func,
    product: PropTypes.object,
    visible: PropTypes.bool,
};

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProductModal);

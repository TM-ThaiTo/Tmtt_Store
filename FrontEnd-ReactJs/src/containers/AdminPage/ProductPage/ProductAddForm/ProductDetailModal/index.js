import React, { Component } from 'react';
import { EditOutlined, InfoCircleOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Row, Tooltip, Upload } from 'antd';
import Compressor from 'compressorjs';
import PropTypes from 'prop-types';

class ProductDesc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: false,
            isAdded: false,
            compFileList: new Array(5),

            length: 2000,
        };
    }

    onCompressFile = async (file, index) => {
        new Compressor(file, {
            // quality: constants.COMPRESSION_RADIO,
            // convertSize: constants.COMPRESSION_RADIO_PNG,
            quality: 0.6,
            convertSize: 2000000,
            success: (fileCompressed) => {
                const reader = new FileReader();
                reader.readAsDataURL(fileCompressed);
                reader.onloadend = async () => {
                    const { compFileList } = this.state;
                    compFileList[index] = reader.result;
                    this.setState({ compFileList });
                };
            },
            error: (err) => {
                message.error('Lỗi: ', err);
            },
        });
    };

    // xác nhận
    onHandleSubmit = (data) => {
        const { onGetDetailDesc } = this.props;
        const { compFileList } = this.state;
        const { desList, title } = data;

        for (let i = 0; i < desList.length; ++i) {
            if (!compFileList[i]) {
                message.error('Upload đầy đủ hình ảnh');
                return;
            }
        }

        const detailDesList = desList.map((item, index) => ({
            content: item,
            photo: compFileList[index],
        }));

        onGetDetailDesc({ title, detailDesList });
        this.setState({ isVisible: false, isAdded: true });
    };

    render() {
        // const { isVisible, isAdded, compFileList, length } = this.state;
        const { isVisible, isAdded, length } = this.state;
        return (
            <>
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Button
                        className="w-100"
                        size="large"
                        icon={isAdded ? <EditOutlined /> : <PlusOutlined />}
                        onClick={() => this.setState({ isVisible: true })}
                        type="dashed">
                        {isAdded ? 'Chỉnh sửa ' : 'Thêm '} mô tả chi tiết
                    </Button>
                </Col>
                <Modal
                    destroyOnClose={false}
                    visible={isVisible}
                    width={1000}
                    centered
                    title="Mô tả chi tiết sản phẩm"
                    onCancel={() => this.setState({ isVisible: false })}
                    footer={[
                        <Button key="back" onClick={() => this.setState({ isVisible: false })}>
                            Quay lại
                        </Button>,
                        <Button
                            key="submit"
                            htmlType="submit"
                            form="detailForm"
                            type="primary"
                        >
                            Submit
                        </Button>,
                    ]}
                >
                    <Form name="detailForm" onFinish={this.onHandleSubmit}>
                        <Row gutter={[16, 0]}>
                            <Col span={24}>
                                <Form.Item
                                    name="title"
                                    rules={[
                                        { required: true, message: 'Bắt buộc', whitespace: true },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        placeholder="Tiêu đề, tên sp *"
                                        suffix={
                                            <Tooltip title="Laptop Apple MacBook 13.3 MPXR2ZP/A">
                                                <InfoCircleOutlined style={{ color: '#ccc' }} />
                                            </Tooltip>
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.List
                                    name="desList"
                                    rules={[
                                        {
                                            validator: async (_, names) => {
                                                if (!names || names.length < 2) {
                                                    return Promise.reject(
                                                        new Error('Ít nhất 2 đoạn mô tả'),
                                                    );
                                                }
                                            },
                                        },
                                    ]}
                                >
                                    {(fields, { add, remove }, { errors }) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <Row key={index}>
                                                    <Col span={24}>
                                                        <Form.Item
                                                            className="m-b-0"
                                                            {...field}
                                                            name={[field.name]}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Bắt buộc',
                                                                    whitespace: true,
                                                                },
                                                            ]}
                                                        >
                                                            <div className="d-flex">
                                                                <Input.TextArea
                                                                    className="flex-grow-1"
                                                                    rows={5}
                                                                    placeholder={`Đoạn mô tả ${index + 1} *`}
                                                                    maxLength={length}
                                                                    showCount
                                                                />
                                                                <MinusCircleOutlined
                                                                    style={{
                                                                        flexBasis: '36px',
                                                                        alignSelf: 'center',
                                                                    }}
                                                                    onClick={() => {
                                                                        remove(field.name);
                                                                        const { compFileList } = this.state;
                                                                        compFileList[index] = null;
                                                                        this.setState({ compFileList });
                                                                    }}
                                                                />
                                                            </div>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={24} className="m-b-16">
                                                        <Upload
                                                            listType="picture"
                                                            onRemove={() => {
                                                                const { compFileList } = this.state;
                                                                compFileList[index] = null;
                                                                this.setState({ compFileList });
                                                            }}
                                                            beforeUpload={(file) => {
                                                                this.onCompressFile(file, index);
                                                                return false;
                                                            }}
                                                        >
                                                            <Button size="large" icon={<UploadOutlined />}>
                                                                {`Thêm hình ảnh ${index + 1}`}
                                                            </Button>
                                                        </Upload>
                                                    </Col>
                                                </Row>
                                            ))}

                                            <Form.ErrorList errors={errors} />
                                            {fields.length < 5 && (
                                                <Form.Item>
                                                    <Button
                                                        type="dashed"
                                                        className="w-100"
                                                        size="large"
                                                        onClick={() => add()}
                                                        icon={<PlusOutlined />}
                                                    >
                                                        Thêm đoạn mô tả
                                                    </Button>
                                                </Form.Item>
                                            )}
                                        </>
                                    )}
                                </Form.List>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }
}

ProductDesc.propTypes = {
    onGetDetailDesc: PropTypes.func.isRequired,
};

export default ProductDesc;

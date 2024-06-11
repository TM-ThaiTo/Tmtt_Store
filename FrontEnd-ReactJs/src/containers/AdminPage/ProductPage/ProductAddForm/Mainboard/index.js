import React, { Component } from 'react';
import { Col, Form, Input, Row, Select, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

const suffixColor = '#aaa';
class Mainboard extends Component {

    SOCKET_TYPES = [
        { type: 0, label: '1151-v2' },
        { type: 1, label: '1200' },
        { type: 2, label: 'AM4' },
        { type: 3, label: '1151' },
        { type: 4, label: 'sTRX' },
    ];
    SIZE_STD = [
        { type: 0, label: 'Micro-ATX' },
        { type: 1, label: 'ATX' },
        { type: 2, label: 'Extended-ATX' },
        { type: 3, label: 'Mini-ATX' },
        { type: 4, label: 'XL-ATX' },
    ];

    render() {
        return (
            <Row gutter={[16, 16]}>
                {/* Chip set */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="chipset"
                        rules={[{ required: true, message: 'Bắt buộc', whitespace: true }]}>
                        <Input
                            size="large"
                            placeholder="Chip set *"
                            suffix={
                                <Tooltip title="Z490">
                                    <InfoCircleOutlined style={{ color: suffixColor }} />
                                </Tooltip>
                            }
                        />
                    </Form.Item>
                </Col>
                {/* Series */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="series"
                        rules={[{ required: true, message: 'Bắt buộc', whitespace: true }]}>
                        <Input
                            size="large"
                            placeholder="Series *"
                            suffix={
                                <Tooltip title="KHT">
                                    <InfoCircleOutlined style={{ color: suffixColor }} />
                                </Tooltip>
                            }
                        />
                    </Form.Item>
                </Col>
                {/* Loại socket */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="socketType"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Loại socket *">
                            {this.SOCKET_TYPES.map((item, index) => (
                                <Select.Option value={item.label} key={index}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                {/* Chuẩn kích thước */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="sizeStd"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Chuẩn kích thước *">
                            {this.SIZE_STD.map((item, index) => (
                                <Select.Option value={item.label} key={index}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        )
    }
}

// Map state từ Redux store vào props của component
const mapStateToProps = state => {
    return {
        // isLoggedIn: state.auth.isLoggedIn,
        // adminName: state.auth.adminName
    };
};

// Map các action creators để dispatch vào props của component
const mapDispatchToProps = dispatch => {
    return {
        // Ví dụ: loginAction: (name) => dispatch(actions.login(name)),
        // logoutAction: () => dispatch(actions.logout())
    };
};

// Kết nối component với Redux store
export default connect(mapStateToProps, mapDispatchToProps)(Mainboard);

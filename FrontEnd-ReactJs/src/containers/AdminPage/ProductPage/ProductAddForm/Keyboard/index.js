import React, { Component } from 'react';
import { Col, Form, Row, Select } from 'antd';
import { connect } from 'react-redux';

const KEYBOARD_TYPES = [
    { type: 0, label: 'bàn phím thường' },
    { type: 1, label: 'Bàn phím giả cơ' },
    { type: 2, label: 'Bàn phím cơ' },
];
const KEYBOARD_COLORS = [
    { type: 0, label: 'Đen' },
    { type: 1, label: 'Bạc' },
    { type: 2, label: 'Trắng' },
    { type: 3, label: 'Hồng' },
    { type: 4, label: 'Khác' },
];
const KEYBOARD_LED_COLORS = [
    { type: 0, label: 'Không led' },
    { type: 1, label: 'Đơn sắc' },
    { type: 2, label: 'Rainbow' },
    { type: 3, label: 'RGB' },
];

class Keyboard extends Component {

    render() {
        return (
            <Row gutter={[16, 16]}>
                {/* Loại bàn phím */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="type"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Loại bàn phím *">
                            {KEYBOARD_TYPES.map((item, index) => (
                                <Select.Option value={item.label} key={index}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                {/* Màu bàn phím */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="color"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Màu bàn phím *">
                            {KEYBOARD_COLORS.map((item, index) => (
                                <Select.Option value={item.label} key={index}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                {/* Màu đèn led */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="ledColor"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Màu đèn led *">
                            {KEYBOARD_LED_COLORS.map((item, index) => (
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
export default connect(mapStateToProps, mapDispatchToProps)(Keyboard);

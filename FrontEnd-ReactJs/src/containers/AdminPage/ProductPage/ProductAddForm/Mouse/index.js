import React, { Component } from 'react';
import { Col, Form, Row, Select } from 'antd';
import { connect } from 'react-redux';

const MOUSE_TYPES = [
    { type: 0, label: 'Có dây' },
    { type: 1, label: 'Không dây' },
];

const MOUSE_LEDS = [
    { type: true, label: 'Có led' },
    { type: false, label: 'Không Led' },
];
class Mouse extends Component {

    render() {
        return (
            <Row gutter={[16, 16]}>
                {/* Loại Chuột */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="type"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Loại Chuột *">
                            {MOUSE_TYPES.map((item, index) => (
                                <Select.Option value={item.label} key={index}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                {/* Đèn Led */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="isLed"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Đèn Led *">
                            {MOUSE_LEDS.map((item, index) => (
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
export default connect(mapStateToProps, mapDispatchToProps)(Mouse);

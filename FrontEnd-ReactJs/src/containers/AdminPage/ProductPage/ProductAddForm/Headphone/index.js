import React, { Component } from 'react';
import { Col, Form, Row, Select } from 'antd';
import { connect } from 'react-redux';
const HEADPHONE_TYPES = [
    { type: 0, label: 'Over-ear' },
    { type: 1, label: 'In-ear' },
    { type: 2, label: 'On-ear' },
    { type: 3, label: 'KHT' },
];
const CONNECTION_STD = [
    { type: 0, label: '3.5mm' },
    { type: 1, label: 'bluetooth' },
    { type: 2, label: 'USB' },
    { type: 3, label: 'bluetooth 4.0' },
    { type: 4, label: 'bluetooth 5.0' },
    { type: 5, label: '2.4GHz Wireless' },
];

class Headphone extends Component {

    render() {
        return (
            <Row gutter={[16, 16]}>
                {/* Loại tai nghe */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="type"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Loại tai nghe *">
                            {HEADPHONE_TYPES.map((item, index) => (
                                <Select.Option value={item.label} key={index}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                {/* Chuẩn kết nối  */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="connectionStd"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Chuẩn kết nối  *">
                            {CONNECTION_STD.map((item, index) => (
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
export default connect(mapStateToProps, mapDispatchToProps)(Headphone);

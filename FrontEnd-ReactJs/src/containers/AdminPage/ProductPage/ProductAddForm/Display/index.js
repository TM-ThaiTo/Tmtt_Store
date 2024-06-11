import React, { Component } from 'react';
import { Col, Form, InputNumber, Row, Select } from 'antd';
import { connect } from 'react-redux';

const MANUFACTURERS = [
    { type: 0, label: 'NVIDIA' },
    { type: 1, label: 'AMD' },
];

class Display extends Component {
    getInfoDisplay = () => {
        const { form } = this.props;
        const capacity = form.getFieldValue('capacity');
        const manufacturer = form.getFieldValue('manufacturer');

        // Create and return the infoRam object
        const infoDisplay = {
            capacity,
            manufacturer,
        };

        return infoDisplay;
    };

    render() {
        return (
            <Row gutter={[16, 16]}>
                {/* Dung lượng (GB) */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="capacity"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            step={1}
                            size="large"
                            min={0}
                            max={100}
                            placeholder="Dung lượng (GB) *"
                        />
                    </Form.Item>
                </Col>
                {/* Nhà sản xuất */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="manufacturer"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Nhà sản xuất *">
                            {MANUFACTURERS.map((item, index) => (
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
export default connect(mapStateToProps, mapDispatchToProps)(Display);

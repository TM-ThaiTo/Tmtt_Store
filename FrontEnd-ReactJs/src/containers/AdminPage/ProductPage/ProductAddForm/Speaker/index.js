import React, { Component } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Form, Input, InputNumber, Row, Tooltip } from 'antd';
import { connect } from 'react-redux';
const suffixColor = '#aaa';
class Speaker extends Component {

    render() {
        return (
            <Row gutter={[16, 16]}>
                {/* Công suất (W) */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="wattage"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            step={10}
                            size="large"
                            min={0}
                            max={10000}
                            placeholder="Công suất (W) *"
                        />
                    </Form.Item>
                </Col>
                {/* Loại cổng kết nối */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="connectionPort"
                        rules={[{ required: true, message: 'Bắt buộc', whitespace: true }]}>
                        <Input
                            size="large"
                            placeholder="Loại cổng kết nối *"
                            suffix={
                                <Tooltip title="3.5 mm">
                                    <InfoCircleOutlined style={{ color: suffixColor }} />
                                </Tooltip>
                            }
                        />
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
export default connect(mapStateToProps, mapDispatchToProps)(Speaker);

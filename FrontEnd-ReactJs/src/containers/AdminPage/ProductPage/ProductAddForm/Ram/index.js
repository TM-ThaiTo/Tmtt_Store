import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Form, InputNumber, Row, Select } from 'antd';

const BUS_TYPES = [
    { type: 1600, label: '1600' },
    { type: 2400, label: '2400' },
    { type: 2666, label: '2666' },
    { type: 3000, label: '3000' },
    { type: 3200, label: '3200' },
    { type: 3333, label: '3333' },
    { type: 3600, label: '3600' },
    { type: 4000, label: '4000' },
    { type: 5600, label: '5600' },
];

const RAM_TYPES = [
    { type: 0, label: 'DDR3' },
    { type: 1, label: 'DDR3L' },
    { type: 2, label: 'DDR4' },
    { type: 3, label: 'DDR5' },
];

class Ram extends Component {

    // Function to get RAM information
    getInfoRam = () => {
        const { form } = this.props;
        const capacity = form.getFieldValue('capacity');
        const bus = form.getFieldValue('bus');
        const type = form.getFieldValue('type');

        // Create and return the infoRam object
        const infoRam = {
            capacity,
            bus,
            type,
        };

        return infoRam;
    };
    render() {
        return (
            <Row gutter={[16, 16]}>
                {/* Dung lượng (GB) */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="capacity"
                        rules={[
                            { required: true, message: 'Bắt buộc' },
                            () => ({
                                validator(rule, value) {
                                    if ([2, 4, 8, 16, 32, 64].indexOf(value) !== -1) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Dung lượng là luỹ thừa 2, max = 128GB');
                                },
                            }),
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            step={2}
                            size="large"
                            min={2}
                            max={64}
                            placeholder="Dung lượng (GB) *"
                        />
                    </Form.Item>
                </Col>
                {/* Loại bus */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item name="bus" rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Loại bus (MHz) *">
                            {BUS_TYPES.map((item, index) => (
                                <Select.Option value={item.label} key={index}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                {/* Thế hệ RAM */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item name="type" rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Thế hệ RAM *">
                            {RAM_TYPES.map((item, index) => (
                                <Select.Option value={item.label} key={index}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        );
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
export default connect(mapStateToProps, mapDispatchToProps)(Ram);

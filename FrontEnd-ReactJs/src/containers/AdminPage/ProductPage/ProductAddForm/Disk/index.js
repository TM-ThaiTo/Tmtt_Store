import React, { Component } from 'react';
import { Col, InputNumber, Row, Form, Select } from 'antd';
import { connect } from 'react-redux';

const SIZE_OPTIONS = [
    { type: 0, label: '2.5"' },
    { type: 1, label: '3.5"' },
    { type: 2, label: 'M.2 2880' },
    { type: 3, label: 'M.2' },
];

const DISK_TYPES = [
    { type: 0, label: 'HDD' },
    { type: 1, label: 'SSD' },
];

const CONNECTION_STD = [
    { type: 0, label: 'SATA' },
    { type: 1, label: 'USB 3.0' },
    { type: 2, label: 'M.2 SATA' },
    { type: 3, label: 'M.2 NVMe' },
];

class Disk extends Component {

    getInfoDisk = () => {
        const { from } = this.props;
        const capacity = from.getFieldValue('capacity');
        const size = from.getFieldValue('size');
        const connectionStd = from.getFieldValue('connectionStd');
        const type = from.getFieldValue('type');

        const readSpeed = from.getFieldValue('readSpeed');
        const writeSpeed = from.getFieldValue('writeSpeed');
        const rpm = from.getFieldValue('rpm');

        const infoDisk = {
            capacity: capacity.toString(),
            size: size.toString(),
            connectionStd: connectionStd.toString(),
            type: type.toString(),
            readSpeed: readSpeed,
            writeSpeed: writeSpeed,
            rpm: rpm,
        }
        return infoDisk;
    };


    render() {
        return (
            <Row gutter={[16, 16]}>
                {/* Dung lượng */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="capacity"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            step={128}
                            size="large"
                            min={0}
                            max={10000}
                            placeholder="Dung lượng (GB) *"
                        />
                    </Form.Item>
                </Col>
                {/* Kích cỡ */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="size"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Kích cỡ *">
                            {SIZE_OPTIONS.map((item, index) => (
                                <Select.Option value={item.label} key={index}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                {/* Chuẩn kết nối */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="connectionStd"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Chuẩn kết nối *">
                            {CONNECTION_STD.map((item, index) => (
                                <Select.Option value={item.label} key={index}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                {/* Loại ổ cứng */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item
                        name="type"
                        rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Select size="large" placeholder="Loại ổ cứng *">
                            {DISK_TYPES.map((item, index) => (
                                <Select.Option value={item.label} key={index}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                {/* Tốc độ đọc */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item name="readSpeed">
                        <InputNumber
                            style={{ width: '100%' }}
                            step={100}
                            size="large"
                            min={0}
                            max={10000}
                            placeholder="Tốc độ đọc (MB/s)"
                        />
                    </Form.Item>
                </Col>
                {/* Tốc độ ghi */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item name="writeSpeed">
                        <InputNumber
                            style={{ width: '100%' }}
                            step={100}
                            size="large"
                            min={0}
                            max={10000}
                            placeholder="Tốc độ ghi (MB/s)"
                        />
                    </Form.Item>
                </Col>
                {/* RPM (HDD) */}
                <Col span={12} md={8} xl={6} xxl={4}>
                    <Form.Item name="rpm">
                        <InputNumber
                            style={{ width: '100%' }}
                            step={100}
                            size="large"
                            min={0}
                            max={100000}
                            placeholder="RPM (* HDD)"
                        />
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
export default connect(mapStateToProps, mapDispatchToProps)(Disk);

import React, { Component } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, message, Row, Tooltip } from 'antd';
import { FastField, Form, Formik } from 'formik';
import { connect } from 'react-redux';
import { postUpdateUser } from '../../../services/userService.js';
import DatePickerField from '../../../components/Custom/Field/DatePickerField';
import InputField from '../../../components/Custom/Field/InputField';
import SelectField from '../../../components/Custom/Field/SelectField';
import constants from '../../../constants/index';
import helpers from '../../../helpers';

class UpdateAccountForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false,
            user: [],
        };
    }

    // fn: Hàm update
    handleUpdate = async (value) => {
        const { user } = this.state;

        // chuẩn bị data
        const data = {
            Id_account: user.id_account,
            email: value.email,
            fullName: value.fullName,
            address: value.address,
            birthday: value.birthday,
            gender: value.gender,
        }
        try {
            this.setState({ isSubmitting: true });
            const response = await postUpdateUser(data);
            if (response && response.code === 0) {
                message.success('Cập nhật thành công.');
                this.setState({ isSubmitting: false });
            }
            else {
                message.error(response.message, 3);
            }
        } catch (error) {
            message.error('Cập nhật thất bại. Vui lòng thử lại', 2);
            this.setState({ isSubmitting: false });
        }
    };

    // fn: hàm cập nhật đầu tiên
    componentDidMount = () => {
        const user = this.props.user;
        this.setState({
            user: user
        })
    }

    // fn: Render
    render() {
        const { isSubmitting } = this.state;
        const { user } = this.state;
        const bd = helpers.formatOrderDate(user.birthday, 1);
        // giá trọ khởi tạo cho formik
        const initialValue = {
            email: user.email,
            fullName: user.fullName,
            address: user.address,
            gender: user.gender,
            birthday: bd,
        };
        return (
            <>
                {user.email && (
                    <Formik
                        initialValues={initialValue}
                        // validationSchema={validationSchema}
                        onSubmit={(value) => this.handleUpdate(value)}>
                        {(formikProps) => {
                            const suffixColor = 'rgba(0, 0, 0, 0.25)';
                            return (
                                <Form className="box-sha-home-update-form">
                                    <Row className="row" gutter={[32, 32]} style={{ margin: 0 }}>
                                        <Col className="input-update-form" span={24} md={12}>
                                            {/* email field */}
                                            <FastField
                                                name="email"
                                                component={InputField}
                                                disabled={true}
                                                className="input-form-common"
                                                placeholder="Email *"
                                                size="large"
                                                suffix={
                                                    <Tooltip title="Email của bạn">
                                                        <InfoCircleOutlined
                                                            style={{
                                                                color: suffixColor,
                                                            }}
                                                        />
                                                    </Tooltip>
                                                }
                                            />
                                        </Col>
                                        <Col className="input-update-form" span={24} md={12}>
                                            {/* full name field */}
                                            <FastField
                                                name="fullName"
                                                component={InputField}
                                                className="input-form-common"
                                                placeholder="Họ và tên *"
                                                size="large"
                                                suffix={
                                                    <Tooltip title="Họ và tên của bạn">
                                                        <InfoCircleOutlined style={{ color: suffixColor }} />
                                                    </Tooltip>
                                                }
                                            />
                                        </Col>
                                        <Col className="input-update-form" span={24} md={12}>
                                            {/* birthday field */}
                                            <FastField
                                                className="input-form-common"
                                                name="birthday"
                                                component={DatePickerField}
                                                placeholder="Ngày sinh *"
                                                size="large"
                                            />
                                        </Col>
                                        <Col className="input-update-form" span={24} md={12}>
                                            {/* gender field */}
                                            <FastField
                                                className="input-form-common gender-field"
                                                size="large"
                                                name="gender"
                                                component={SelectField}
                                                placeholder="Giới tính *"
                                                options={constants.GENDER_OPTIONS}
                                            />
                                        </Col>
                                        <Col className="input-update-form" span={24} md={12}>
                                            {/* address field */}
                                            <FastField
                                                name="address"
                                                component={InputField}
                                                className="input-form-common"
                                                placeholder="Địa chỉ"
                                                size="large"
                                                suffix={
                                                    <Tooltip title="Địa chỉ của bạn">
                                                        <InfoCircleOutlined style={{ color: suffixColor }} />
                                                    </Tooltip>
                                                }
                                            />
                                        </Col>
                                        {/* Button submit */}
                                        <Col className="btn-update-from " span={24}>
                                            <Button
                                                className="w-30"
                                                size="large"
                                                type="primary"
                                                loading={isSubmitting}
                                                htmlType="submit">
                                                {isSubmitting ? 'Đang cập nhật ...' : 'Cập nhật'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            );
                        }}
                    </Formik>
                )}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isAuth: state.authenticate.isAuth,
        user: state.user,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateAccountForm);
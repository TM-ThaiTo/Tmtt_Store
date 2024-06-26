import React, { Component } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, message, Row, Tooltip } from 'antd';
import { Redirect, Link } from 'react-router-dom';
import { FastField, Form, Formik } from 'formik';
import { postResetPassword, postSendVerifyCode } from '../../../../services/accountService.js';
import InputField from '../../../../components/Custom/Field/InputField';
import Delay from '../../../../components/Delay/index.js';
import constants from '../../../../constants/index.js';
import './ForgotPassword.scss';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false,
            isSuccess: false,
            isSending: false,
        };
        this.emailRef = React.createRef();
    }

    // fn: sự kiện gữi mã
    onSendCode = async () => {
        try {
            const username = this.emailRef.current;
            const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!regex.test(username)) {
                message.error('Email không hợp lệ !');
                return;
            }
            this.setState({ isSending: true });
            const data = {
                mail: username,
                title: 2
            }
            const result = await postSendVerifyCode(data);
            if (result.code === 0) {
                message.success('Gửi thành công, kiểm tra username');
                this.setState({ isSending: false });
            }
            else {
                message.error(result.message);
                this.setState({ isSending: false });
            }
        } catch (error) {
            this.setState({ isSending: false });
            if (error.response) {
                message.error(error.response.data.message);
            } else {
                message.error('Gửi thất bại, thử lại');
            }
        }
    };

    // fn: sự kiện lưu mật khẩu mới
    onChangePassword = async (values) => {
        try {
            this.setState({ isSubmitting: true });
            const result = await postResetPassword(values);
            if (result.code === 0) {
                this.setState({ isSubmitting: false, isSuccess: true });
                message.success('Thay đổi mật khẩu thành công.');
            }
            else {
                message.error(result.message);
                this.setState({ isSubmitting: false });
            }
        } catch (error) {
            this.setState({ isSubmitting: false });
            if (error.response) {
                message.error(error.response.data.message);
            } else {
                message.error('Cập nhật thất bại. Thử lại');
            }
        }
    };

    render() {
        const { isSubmitting, isSuccess, isSending } = this.state;

        // tạo các biến để lưu thông tin
        const initialValue = {
            username: '',
            password: '',
            verifyCode: '',
        };

        // render
        return (
            <div className="ForgotPW container">
                <div className='forgot-background '>
                    {isSuccess && (
                        <Delay wait={constants.DELAY_TIME}>
                            <Redirect to={constants.ROUTES.LOGIN} />
                        </Delay>
                    )}

                    <h1 className="Login-title m-b-20 m-t-20 underline-title">
                        <b>Thay đổi mật khẩu</b>
                    </h1>
                    <Formik
                        initialValues={initialValue}
                        // validationSchema={validationSchema}
                        onSubmit={this.onChangePassword}>
                        {(formikProps) => {
                            this.emailRef.current = formikProps.values.username;
                            const suffixColor = 'rgba(0, 0, 0, 0.25)';
                            return (
                                <Form className="bg-form">
                                    <Row
                                        className="input-border p-l-20 p-r-20"
                                        gutter={[40, 24]}
                                        justify="center"
                                        style={{ margin: 0 }}>

                                        {/* username */}
                                        <Col span={24}>
                                            <FastField
                                                name="username"
                                                component={InputField}
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

                                        {/* password */}
                                        <Col span={24}>
                                            <FastField
                                                name="password"
                                                component={InputField}
                                                className="input-form-common"
                                                type="password"
                                                placeholder="Mật khẩu *"
                                                size="large"
                                                autoComplete="on"
                                                iconRender={(visible) =>
                                                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                                }
                                            />
                                        </Col>

                                        {/* mã xác nhận */}
                                        <Col span={12}>
                                            <FastField
                                                name="verifyCode"
                                                component={InputField}
                                                className="input-form-common"
                                                placeholder="Mã xác nhận *"
                                                size="large"
                                                suffix={
                                                    <Tooltip title="Click gửi mã để nhận mã qua username">
                                                        <InfoCircleOutlined
                                                            style={{ color: suffixColor }}
                                                        />
                                                    </Tooltip>
                                                }
                                            />
                                        </Col>

                                        {/* btn gửi mã */}
                                        <Col span={12}>
                                            <Button
                                                className="w-100 verify-btn"
                                                type="primary"
                                                size="large"
                                                onClick={this.onSendCode}
                                                loading={isSending}>
                                                Gửi mã
                                            </Button>
                                        </Col>

                                        {/* btn đổi mật khẩu */}
                                        <Col className="forgot-button" span={24}>
                                            <Button
                                                className="ForgotPW-submit-btn w-100"
                                                size="large"
                                                type="primary"
                                                htmlType="submit"
                                                loading={isSubmitting}>
                                                Thay đổi mật khẩu
                                            </Button>
                                            <div className="quaylai">
                                                Quay lại &nbsp;
                                                <Link to={constants.ROUTES.LOGIN}>Đăng nhập</Link>
                                                &nbsp; Hoặc &nbsp;
                                                <Link to={constants.ROUTES.SIGNUP}>Đăng ký</Link>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        );
    }
}

export default ForgotPassword;

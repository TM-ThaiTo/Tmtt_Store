import React, { Component } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, message, Row, Tooltip } from 'antd';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FastField, Form, Formik } from 'formik';
import { Redirect, Link } from 'react-router-dom';
import { postSendVerifyCode, postSignUp } from '../../../../services/accountService.js';
import SelectField from '../../../../components/Custom/Field/SelectField.js';
import InputField from '../../../../components/Custom/Field/InputField.js';
import DatePickerField from '../../../../components/Custom/Field/DatePickerField.js';
import Delay from '../../../../components/Delay/index.js'
import constants from '../../../../constants/index.js';
import LoginGoogle from '../../../../components/LoginGoogle/index.js';
import './SignUp_User.scss';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSending: false,
            isSubmitting: false,
            isRedirectLogin: false,
            isDisableLogin: false,
            emailInput: '',
        };
        this.emailRef = React.createRef();
    }

    validateFormData = (data) => {
        const errors = {};

        // Kiểm tra email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.username)) {
            errors.email = "Email không hợp lệ";
            message.error("Email không hợp lệ", 3);
            return;
        }

        // Kiểm tra mã xác nhận
        if (data.verifyCode.length !== 6) {
            errors.verifyCode = "Mã xác nhận không hợp lệ";
            message.error("Mã xác nhận phải có 6 số", 3);
            return;
        }

        // Kiểm tra mật khẩu
        if (!/^(?=.*[A-Z])(?=.*[~!@#%^&*()_+\-=|,./[\]{}'"`])(?=.*[0-9])(?=.*[a-z]).{6,20}$/.test(data.password)) {
            errors.password = "Mật khẩu không hợp lệ";
            message.error("Mật khẩu ít nhất 6 ký tự, có kí tự viết hoa và đặt biệt ", 3);
            return;
        }

        // Kiểm tra xác nhận mật khẩu
        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = "Xác nhận mật khẩu không đúng";
            message.error("Xác nhận mật khẩu không đúng", 3);
            return;
        }

        // Kiểm tra họ và tên
        if (!/^[^~!@#%^&*()_+\-=|,./[\]{}'"`]{1,70}$/.test(data.fullName)) {
            errors.fullName = "Họ và tên không hợp lệ";
            message.error("Họ và tên không hợp lệ", 3);
            return;
        }

        // Kiểm tra ngày sinh
        if (!this.isValidBirthday(data.birthday)) {
            errors.birthday = "Ngày sinh không hợp lệ";
            message.error("Ngày sinh phải lớn hơn 8 tuổi", 3);
            return;
        }

        // Kiểm tra giới tính
        if (data.gender !== 1 && data.gender !== 2 && data.gender !== 3) {
            errors.gender = "Giới tính không hợp lệ";
            message.error("Giới tính không hợp lệ", 3);
            return;
        }

        // Kiểm tra địa chỉ
        if (data.address.length > 100 || data.address === "") {
            errors.address = "Địa chỉ không hợp lệ";
            message.error("Địa chỉ không hợp lệ", 3);
            return;
        }
        return errors;
    }

    isValidBirthday = (birthday) => {
        // Chuyển đổi ngày sinh thành đối tượng Date
        const birthdayDate = new Date(birthday);

        // Kiểm tra nếu ngày sinh có giá trị null hoặc không phải là đối tượng Date hợp lệ
        if (!birthdayDate || isNaN(birthdayDate.getTime())) {
            return false;
        }

        // Lấy ngày hiện tại
        const currentDate = new Date();

        // Đặt ngày tối thiểu là 1/1/1900
        const minBirthday = new Date(1900, 0, 1);

        // Đặt ngày tối đa là ngày hiện tại trừ đi độ tuổi tối thiểu
        const maxBirthday = new Date(currentDate.getFullYear() - constants.MIN_AGE, currentDate.getMonth(), currentDate.getDate());

        // So sánh ngày sinh với ngày tối thiểu và ngày tối đa
        return birthdayDate >= minBirthday && birthdayDate <= maxBirthday;
    }

    // fn: sự kiện gửi mã xác nhận
    onSendCode = async () => {
        try {
            const username = this.emailRef.current;
            const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

            // kiểm tra email
            if (!regex.test(username)) {
                message.error('Email không hợp lệ !');
                return;
            }
            this.setState({ isSending: true });
            // gọi api
            const data = {
                mail: username,
                title: 1,
            };
            const result = await postSendVerifyCode(data);
            if (result.code === 0) {
                message.success('Gửi thành công, kiểm tra email');
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

    // fn: sự kiện nhấn đăng kí
    onSignUp = async (account) => {
        const validate = this.validateFormData(account);
        if (validate === undefined) {
            message.error("Lỗi thông tin người dung", 3);
            return;
        }

        try {
            this.setState({
                isSubmitting: true,
            });
            const result = await postSignUp(account);
            if (result.code === 0) {
                message.success('Đăng ký thành công.', 1);
                this.setState({
                    isSubmitting: false,
                    isRedirectLogin: true,
                });
            } else {
                message.error(result.message, 1);
                this.setState({
                    isSubmitting: false,
                });
            }
        } catch (error) {
            this.setState({
                isSubmitting: false,
            });
            if (error.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Đăng ký thất bại, thử lại');
            }
        }
    };

    // fn: rendering
    render() {
        const { isSending, isSubmitting, isRedirectLogin } = this.state;

        // tạo các biến để lưu thông tin
        const initialValue = {
            username: '',
            verifyCode: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            address: '',
            gender: null,
        };

        console.log("check account: ", initialValue);

        return (
            <div className="br container">
                {isRedirectLogin && (
                    <Delay wait={constants.DELAY_TIME}>
                        <Redirect to={constants.ROUTES.LOGIN} />
                    </Delay>
                )}

                <h1 className="SignUp-title underline-title m-b-20 m-t-20">
                    <b>Đăng ký tài khoản</b>
                </h1>

                <Formik
                    initialValues={initialValue}
                    onSubmit={this.onSignUp}
                >
                    {(formikProps) => {
                        this.emailRef.current = formikProps.values.username;
                        const suffixColor = 'rgba(0, 0, 0, 0.25)';
                        return (
                            <Form className="bg-form  SignUp">
                                <Row
                                    className="input-border"
                                    gutter={[64, 32]}
                                    style={{ margin: 0 }}
                                >
                                    <Col className="p-b-0" span={24} md={12}>
                                        <Row gutter={[0, 16]}>
                                            <h2>Thông tin tài khoản</h2>

                                            {/* email */}
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

                                            {/* mã xác nhận */}
                                            <Col span={12}>
                                                <FastField
                                                    name="verifyCode"
                                                    component={InputField}
                                                    className="input-form-common"
                                                    placeholder="Mã xác nhận *"
                                                    size="large"
                                                    suffix={
                                                        <Tooltip title="Click gửi mã để nhận mã qua email">
                                                            <InfoCircleOutlined
                                                                style={{ color: suffixColor }}
                                                            />
                                                        </Tooltip>
                                                    }
                                                />
                                            </Col>
                                            {/* btn gửi Mã */}
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
                                            {/* xác nhận password */}
                                            <Col span={24}>
                                                <FastField
                                                    name="confirmPassword"
                                                    component={InputField}
                                                    className="input-form-common"
                                                    type="password"
                                                    placeholder="Xác nhận mật khẩu *"
                                                    size="large"
                                                    iconRender={(visible) =>
                                                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>

                                    {/* Form thông tin chi tiết */}
                                    <Col className="p-b-0" span={24} md={12}>
                                        <Row gutter={[0, 16]}>
                                            <h2>Thông tin chi tiết</h2>

                                            {/* Họ và tên */}
                                            <Col span={24}>
                                                <FastField
                                                    name="fullName"
                                                    component={InputField}
                                                    className="input-form-common"
                                                    placeholder="Họ và tên *"
                                                    size="large"
                                                    suffix={
                                                        <Tooltip title="Họ và tên của bạn">
                                                            <InfoCircleOutlined
                                                                style={{ color: suffixColor }}
                                                            />
                                                        </Tooltip>
                                                    }
                                                />
                                            </Col>

                                            {/* ngày sinh */}
                                            <Col span={24}>
                                                <FastField
                                                    className="input-form-common"
                                                    name="birthday"
                                                    component={DatePickerField}
                                                    placeholder="Ngày sinh"
                                                    size="large"
                                                />
                                            </Col>

                                            {/* Giới tính */}
                                            <Col span={24}>
                                                <FastField
                                                    className="input-form-common gender-field"
                                                    size="large"
                                                    name="gender"
                                                    component={SelectField}
                                                    placeholder="Giới tính *"
                                                    options={constants.GENDER_OPTIONS}
                                                />
                                            </Col>

                                            {/* Địa chỉ */}
                                            <Col span={24}>
                                                <FastField
                                                    name="address"
                                                    component={InputField}
                                                    className="input-form-common"
                                                    placeholder="Địa chỉ"
                                                    size="large"
                                                    suffix={
                                                        <Tooltip title="Địa chỉ của bạn">
                                                            <InfoCircleOutlined
                                                                style={{ color: suffixColor }}
                                                            />
                                                        </Tooltip>
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>

                                    {/* btn summit */}
                                    <Col className="p-t-8 p-b-0 t-center" span={24}>
                                        <Button
                                            className="SignUp-submit-btn w-100"
                                            size="large"
                                            type="primary"
                                            htmlType="submit"
                                            loading={isSubmitting}
                                        >
                                            Đăng Ký
                                        </Button>
                                    </Col>

                                    {/* đăng kí bằng google */}
                                    <Col span={24} className="p-t-0 t-center google">
                                        <div className="or-option" style={{ color: '#acacac' }}>
                                            HOẶC
                                        </div>
                                        <div className='item-khac'>
                                            <GoogleOAuthProvider clientId={"651429717215-3h2h1m8vmja2f54susr8t97qms6hkc82.apps.googleusercontent.com"}>
                                                <LoginGoogle />
                                            </GoogleOAuthProvider>
                                        </div>
                                        <div className="item-khac">
                                            Bạn đã có tài khoản ?
                                            <Link to={constants.ROUTES.LOGIN}>&nbsp;Đăng nhập</Link>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        );
    }
}

export default SignUp;

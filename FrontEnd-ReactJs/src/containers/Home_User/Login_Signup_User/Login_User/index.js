import React, { Component } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, message, Row, Tooltip } from 'antd';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FastField, Form, Formik } from 'formik';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { post_loginuser } from '../../../../services/loginServices.js';
import CheckboxField from '../../../../components/Custom/Field/CheckboxField';
import InputField from '../../../../components/Custom/Field/InputField';
import constants from '../../../../constants/index.js';
import authActions from '../../../../store/actions/authActions.js';
import userActions from '../../../../store/actions/userActions.js';
import LoginGoogle from '../../../../components/LoginGoogle/index.js';
import * as Yup from 'yup';
import './index.scss';

class Login_User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false,
            isDisableLogin: false,
        };
    }

    // fn: xử lý khi đăng nhập thành công
    onLoginSuccess = async (data) => {
        try {
            this.setState({ isSubmitting: false });
            message.success('Đăng nhập thành công');

            localStorage.setItem(constants.REFRESH_TOKEN_KEY, data.refreshToken);
            this.props.setIsAuth(true);
            this.props.getUser();
            localStorage.setItem(constants.ACCESS_TOKEN_KEY, data.accessToken);
            setTimeout(() => {
                this.props.history.push('/');
                window.location.reload();
            }, constants.DELAY_TIME);
        } catch (error) {
            message.error('Lỗi đăng nhập.');
        }
    };

    // fn: đăng nhập
    onLogin = async (account) => {
        try {
            this.setState({ isSubmitting: true });
            const result = await post_loginuser(account);
            if (result && result.code === 0) {
                this.onLoginSuccess(result);
            }
            else {
                this.setState({ isSubmitting: false });
                message.error(result.message);
            }
        } catch (error) {
            this.setState({ isSubmitting: false });
            message.error("Lỗi đăng nhập", 3);
        }
    };

    // fn: xử lý khi đăng nhập thất bại
    onLoginFailed = async (data) => {
        try {
            this.setState({ isSubmitting: false });
            message.error(data.message);
        } catch (error) {
            message.error("Lỗi đăng nhập");
        }
    }

    // fn: rendering
    render() {
        // tạo các biến để lưu thông tin đăng nhập
        const initialValue = {
            email: '',
            password: '',
            keepLogin: false,
        };

        // kiểm tra điều kiện
        const validationSchema = Yup.object().shape({
            email: Yup.string()
                .trim()
                .required('* Email bạn là gì ?')
                .email('* Email không hợp lệ !'),
            password: Yup.string()
                .trim()
                .required('* Mật khẩu của bạn là gì ?'),
        });
        const suffixColor = 'rgba(0, 0, 0, 0.25)';

        //render
        return (
            <>
                <div className='form-login'>
                    <div className="Login container">
                        <div className='Login-title'>
                            <h1 className='m-b-20 m-t-20 underline-title'>
                                <h1>Đăng nhập</h1>
                            </h1>
                        </div>
                        <div className='Login-content'>
                            <Formik
                                initialValues={initialValue}
                                validationSchema={validationSchema}
                                onSubmit={this.onLogin}>
                                {(formikProps) => {
                                    return (
                                        <Form className="bg-form">
                                            <Row
                                                className="input-border"
                                                gutter={[40, 24]}
                                                justify="center"
                                                style={{ margin: 0 }}>
                                                {/* Form thông tin đăng nhập */}

                                                {/* email */}
                                                <Col span={24} className="m-t-20">
                                                    <FastField
                                                        name="email"
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

                                                {/* duy trì đăng Nhập */}
                                                <Col span={24}>
                                                    <div className="d-flex justify-content-between">
                                                        <FastField name="keepLogin" component={CheckboxField}>
                                                            <b>Duy trì đăng nhập</b>
                                                        </FastField>
                                                        <Link
                                                            to="/login/forgot"
                                                            style={{ color: '#50aaff' }}>
                                                            <b>Quên mật khẩu ?</b>
                                                        </Link>
                                                    </div>
                                                </Col>

                                                {/* Button submit */}
                                                <Col className="p-t-8 p-b-0 t-center" span={24}>
                                                    <Button
                                                        className="Login-submit-btn w-100"
                                                        size="large"
                                                        type="primary"
                                                        htmlType="submit"
                                                        disabled={this.state.isDisableLogin}
                                                        loading={this.state.isSubmitting}>
                                                        Đăng nhập
                                                    </Button>
                                                </Col>
                                                {/* đăng kí bằng google */}
                                                <GoogleOAuthProvider clientId={"651429717215-3h2h1m8vmja2f54susr8t97qms6hkc82.apps.googleusercontent.com"}>
                                                    <LoginGoogle />
                                                </GoogleOAuthProvider>
                                                {/* quên mật khẩu hoặc tạo tài khoản */}
                                                <Col span={24} className="btn-dangki">
                                                    <div className="or-option" style={{ color: '#acacac' }}>
                                                        HOẶC
                                                    </div>
                                                    <div className="m-t-20 m-b-20 font-weight-500">
                                                        Bạn chưa đã có tài khoản ?
                                                        <Link to="/signup-user">&nbsp;Đăng ký</Link>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

// map redux đến react
const mapStateToProps = state => {
    return {
        // isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setIsAuth: (isAuth) => dispatch(authActions.setIsAuth(isAuth)),
        getUser: () => dispatch(userActions.getUserRequest())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login_User));

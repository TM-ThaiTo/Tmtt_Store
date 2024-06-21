import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { post_loginuser } from "../../../services/loginServices";
import constants from '../../../constants';
import './index.scss';

class Login extends Component {

    // fn: xử lý khi đăng nhập thành công
    onLoginSuccess = async (data) => {
        try {
            this.setState({ isSubmitting: false });
            message.success('Đăng nhập thành công');
            localStorage.setItem(constants.REFRESH_TOKEN_KEY, data.refreshToken);
            this.props.setIsAuth(true);
            this.props.getUser();
            // this.props.history.push('/');
            window.location.reload();
        } catch (error) {
            message.error('Lỗi đăng nhập.');
        }
    };

    // fn: login admin
    onFinish = async (account) => {
        try {
            const response = await post_loginuser(account);
            if (response && response.code === 0) {
                // lưu thông tin token admin 
                this.onLoginSuccess(response)
                this.props.onLoginAdmin(true, "Super Admin");
            }
            else {
                message.error('Tài khoản không tồn tại hoặc sai mật khẩu');
                this.props.onLoginAdmin(false);
            }
        } catch (error) {
            message.error('Tài khoản không tồn tại hoặc sai mật khẩu', 2);
            this.props.onLoginAdmin(false);
        }
    };

    render() {
        return (
            <div className='center-screen'>
                <h2 className="title">Đăng nhập với quyền Admin</h2>
                <Form name="form" onFinish={this.onFinish}>
                    <div className="custom-login-form">
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Username"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please input your username!' },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24} className='pass-custom'>
                                <Form.Item
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Please input your password!' },
                                    ]}
                                >
                                    <Input.Password className='input-pass-custom' />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item>
                                    <Button
                                        size="large"
                                        className="w-100 m-t-8 custom-login-button"
                                        htmlType="submit"
                                        type="primary"
                                    >
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>
        );
    }
}

Login.propTypes = {
    onLoginAdmin: PropTypes.func,
};

export default Login;

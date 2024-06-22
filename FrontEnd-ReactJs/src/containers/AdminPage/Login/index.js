import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, message, Row, Col, Spin } from 'antd';
import { post_loginuser } from "../../../services/loginServices";
import constants from '../../../constants';
import './index.scss';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
    }

    // fn: xử lý khi đăng nhập thành công
    onLoginSuccess = async (data) => {
        try {
            this.setState({ isLoading: false });
            message.success('Đăng nhập thành công');
            localStorage.setItem(constants.REFRESH_TOKEN_KEY, data.refreshToken);
            this.props.setIsAuth(true);
            this.props.getUser();
        } catch (error) {
            console.error(error);
        }
    };

    // fn: login admin
    onFinish = async (account) => {
        try {
            this.setState({ isLoading: true });
            const response = await post_loginuser(account);
            if (response && response.code === 0) {
                setTimeout(() => {
                    // lưu thông tin token admin 
                    this.onLoginSuccess(response);
                    this.props.onLoginAdmin(true, "Super Admin");
                }, 1000);
            } else {
                message.error('Tài khoản không tồn tại hoặc sai mật khẩu');
                this.props.onLoginAdmin(false);
                this.setState({ isLoading: false });
            }
        } catch (error) {
            message.error('Tài khoản không tồn tại hoặc sai mật khẩu', 2);
            this.props.onLoginAdmin(false);
            this.setState({ isLoading: false });
        }
    };

    render() {
        const { isLoading } = this.state;

        return (
            <div className='center-screen'>
                <h2 className="title">Đăng nhập với quyền Admin</h2>
                <Spin spinning={isLoading}>
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
                                            loading={isLoading} // Hiển thị loading trên nút
                                        >
                                            Đăng nhập
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </Spin>
            </div>
        );
    }
}

Login.propTypes = {
    onLoginAdmin: PropTypes.func,
    setIsAuth: PropTypes.func,
    getUser: PropTypes.func,
};

export default Login;

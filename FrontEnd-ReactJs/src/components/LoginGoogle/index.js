import React, { Component } from 'react';
import { GoogleLogin } from '@react-oauth/google'
import { postLoginWithGoogle } from '../../services/loginServices.js';
import { message } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import constants from '../../constants/index.js';
import authActions from '../../store/actions/authActions.js';
import userActions from '../../store/actions/userActions.js';

class LoginGoogle extends Component {
    // fn: xử lý khi đăng nhập thành công
    onLoginSuccess = async (data) => {
        try {
            this.setState({ isSubmitting: false });
            message.success('Đăng nhập thành công');

            localStorage.setItem(constants.REFRESH_TOKEN, data.refreshToken);
            this.props.setIsAuth(true); // Dispatch action setIsAuth with true
            this.props.getUser(); // gọi redux lấy thông tin người dùng

            if (process.env.NODE_ENV === 'production')
                localStorage.setItem(constants.ACCESS_TOKEN_KEY, data.accessToken);

            setTimeout(() => {
                this.props.history.goBack();
            }, constants.DELAY_TIME);
        } catch (error) {
            message.error('Lỗi đăng nhập.');
        }
    };

    //fn: Xữ lý khi đăng nhập với google
    loginWithGoogle = async (data) => {
        try {
            const response = await postLoginWithGoogle(data);
            if (response && response.code === 0) {
                this.onLoginSuccess(response);
            }
            else {
                message.error(response.message, 3);
            }
        }
        catch {
            message.error("Đăng nhập thất bại!", 3);
        }
    }

    //fn: render
    render() {
        return (
            <GoogleLogin
                onSuccess={credentialResponse => {
                    this.loginWithGoogle(credentialResponse);
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        );
    }
}

// map redux đến react
const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setIsAuth: (isAuth) => dispatch(authActions.setIsAuth(isAuth)),
        getUser: () => dispatch(userActions.getUserRequest())
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginGoogle));

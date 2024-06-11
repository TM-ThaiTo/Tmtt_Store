import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CompassOutlined, NotificationOutlined, ReconciliationOutlined, UserOutlined } from '@ant-design/icons';
import { Result, Row, Col } from 'antd';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import UpdateAccountForm from './UpdateForm';
import userLogo from '../../assets/icon/user_32px.png';
import constants from '../../constants/index';
import AddressUserList from './UserAddressList';
import OrderList from './OrderList';
import './index.scss';

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '',
        };
    }

    renderComponent = (key = '') => {
        switch (key) {
            case '':
                return (
                    <>
                        <h2 className="m-b-12">Thông tin tài khoản</h2>
                        <UpdateAccountForm />
                    </>
                );
            case 'orders':
                return (
                    <>
                        <h2 className="m-b-12">Các đơn hàng của bạn</h2>
                        <OrderList />
                    </>
                );
            case 'addresses':
                return (
                    <>
                        <h2 className="m-b-12">Danh sách địa chỉ giao hàng của bạn</h2>
                        <AddressUserList />
                    </>
                );
            case 'notifications':
                return (
                    <>
                        <h2 className="m-b-12">Thông báo</h2>
                        <Result
                            icon={<NotificationOutlined />}
                            title="Hiện tại, không có thông báo nào"
                        />
                        ,
                    </>
                );
            default:
                <>
                    <h2 className="m-b-12">Thông tin tài khoản</h2>
                    <UpdateAccountForm />
                </>;
        }
    };

    handleMenuClick = (key) => {
        this.setState({ activeKey: key });
    };

    render() {
        const { activeKey } = this.state;
        const { isAuth } = this.props;

        if (!isAuth) {
            return (
                <div style={{ minHeight: '82vh' }}>
                    <Result
                        title="Đăng nhập để xem thông tin"
                        extra={[
                            <Button type="primary" key="signup" className="btn-secondary">
                                <Link to={constants.ROUTES.SIGNUP}>Đăng ký</Link>
                            </Button>,
                            <Button type="primary" key="login">
                                <Link to={constants.ROUTES.LOGIN}>Đăng nhập</Link>
                            </Button>,
                        ]}
                    />
                </div>
            );
        }

        const menu = [
            {
                Icon: <UserOutlined className="menu-item" />,
                title: 'Thông tin tài khoản',
                key: '',
            },
            {
                Icon: (
                    <ReconciliationOutlined className="menu-item" />
                ),
                title: 'Quản lý đơn hàng',
                key: 'orders',
            },
            {
                Icon: <CompassOutlined className="menu-item" />,
                title: 'Địa chỉ giao hàng',
                key: 'addresses',
            },
            {
                Icon: (
                    <NotificationOutlined className="menu-item" />
                ),
                title: 'Thông báo',
                key: 'notifications',
            },
        ];
        return (
            <div className='page-account'>
                <Row className="account-page container m-tb-32">
                    <Col className="p-r-16" span={32} md={6}>
                        {/* giới thiệu */}
                        <div className="d-flex p-b-4 m-b-12 intro">
                            <img src={userLogo} width={32} height={32} className="m-r-12" alt='' />
                            <div>
                                <span className="m-b-0 font-size-16px">Xin chào:</span>
                                <h3>
                                    <b className="name">{this.props.user.fullName}</b>
                                </h3>
                            </div>
                        </div>

                        {/* menu */}
                        <ul className="menu-list m-t-20">
                            {menu.map((item, index) => (
                                <Link
                                    key={index}
                                    to={constants.ROUTES.ACCOUNT + '/' + item.key}
                                >
                                    <li
                                        key={index}
                                        className={`account-page-menu-item p-b-20 ${item.key === activeKey ? 'active' : ''}`}
                                        onClick={() => this.handleMenuClick(item.key)}
                                    >
                                        {item.Icon}
                                        <span className="font-size-20px">{item.title}</span>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </Col>

                    <Col className="p-lr-8" span={24} md={18}>
                        {this.renderComponent(activeKey)}
                    </Col>
                </Row>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);
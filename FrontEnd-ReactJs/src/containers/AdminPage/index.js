import React, { Component } from 'react';
import { DashboardOutlined, EyeOutlined, HomeOutlined, IdcardOutlined, PlusCircleOutlined, ReconciliationOutlined, ShoppingCartOutlined, UserOutlined, CommentOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { connect } from 'react-redux';
import logoUrl from '../../assets/Logo/Logo.png'
import Avatar from 'antd/lib/avatar/avatar';
import defaultAvt from '../../assets/imgs/default-avt.png'
import Dashboard from './Dashboard/index.js';
import SeeProduct from './ProductPage/SeeProduct/index.js';
import AddProduct from './ProductPage/ProductAddForm/index.js';
import AdminUser from './AdminUser/index.js';
import CustomerList from './CustomersUser/index.js';
import OrderList from './OrderList/index.js';
import Login from './Login/index.js';
import ChatUser from './ChatUser/index.js';
import './index.scss';

const mainColor = '#141428';

class AdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keyMenu: 'd',
            isLogin: localStorage.getItem('admin') ? true : false,
            adminName: localStorage.getItem('admin') || 'Admin',
        };

        // menu list chức năng của admin
        this.menuList = [
            {
                key: 'd',
                title: 'Dashboard',
                icon: <DashboardOutlined />,
                children: [],
            },
            {
                key: 'p',
                title: 'Products',
                icon: <ShoppingCartOutlined />,
                children: [
                    { key: 'p0', title: 'See', icon: <EyeOutlined /> },
                    { key: 'p1', title: 'Add', icon: <PlusCircleOutlined /> },
                ],
            },
            {
                key: 'c',
                title: 'Customers',
                icon: <UserOutlined />,
                children: [],
            },
            {
                key: 'a',
                title: 'Amin Users',
                icon: <IdcardOutlined />,
                children: [],
            },
            {
                key: 'o',
                title: 'Order List',
                icon: <ReconciliationOutlined />,
                children: [],
            },
            // {
            //     key: 'm',
            //     title: 'Marketing',
            //     icon: <NotificationOutlined />,
            //     children: [],
            // },
            {
                key: 'm',
                title: 'Chat',
                icon: <CommentOutlined />,
                children: [],
            },
        ];
    }

    // fn: render component tương ứng
    renderMenuComponent = (key) => {
        switch (key) {
            case 'd':
                return <Dashboard />;
            case 'p0':
                return <SeeProduct />;
            case 'p1':
                return <AddProduct />;
            case 'a':
                return <AdminUser />;
            case 'c':
                return <CustomerList />;
            case 'o':
                return <OrderList />;
            case 'm':
                return <ChatUser />

            default:
                break;
        }
    };

    // fn: Xử lý khi chọn item
    handleSelected = (e) => {
        const { key } = e;
        this.setState({ keyMenu: key });
    };

    // fn: Show Title Selected
    showTitleSelected = (key) => {
        let result = 'Dashboard';
        this.menuList.forEach((item) => {
            if (item.key === key) result = item.title;
            item.children.forEach((child) => {
                if (child.key === key) result = `${item.title} > ${child.title}`;
            });
        });
        return result;
    };

    // fn: render MenuItem
    renderMenuItem = () => {
        return this.menuList.map((item) => {
            const { key, icon, title, children } = item;
            if (children.length === 0)
                return (
                    <Menu.Item className="menu-item" key={key} icon={icon}>
                        <span className="menu-item-title">{title}</span>
                    </Menu.Item>
                );
            return (
                <Menu.SubMenu className="menu-item" key={key} icon={icon} title={title}>
                    {children.map((child) => (
                        <Menu.Item className="menu-item" key={child.key} icon={child.icon}>
                            <span className="menu-item-title">{child.title}</span>
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
            );
        });
    };

    // event: Login với quyền admin
    onLogin = (isLogin, name) => {
        if (isLogin) {
            this.setState({ isLogin: true, adminName: name });
            localStorage.setItem('admin', name);
        }
    };

    // event: logout
    onLogout = () => {
        this.setState({ isLogin: false });
        localStorage.removeItem('admin');
    };

    // rendering
    render() {
        const { keyMenu, isLogin, adminName } = this.state;
        return (
            <div className="Admin-Page" style={{ backgroundColor: '#e5e5e5' }}>
                {!isLogin ? (
                    <div className="trans-center bg-white p-32 bor-rad-8 box-sha-home">
                        <Login onLoginAdmin={this.onLogin} />
                    </div>
                ) : (
                    <>
                        {/* header */}
                        <div
                            className="header-admin-page"
                            style={{ height: '75px', backgroundColor: mainColor }}
                        >
                            <div className="logo">
                                <img width={100} height={60} src={logoUrl} alt="Logo" />
                            </div>
                            <div className="link-page">
                                <h2 className="main-title">
                                    <span className='admin-page-title'>Admin Page &gt; </span>
                                    <span className="option-title">
                                        {this.showTitleSelected(keyMenu)}
                                    </span>
                                </h2>
                                <a
                                    href="/"
                                    target='black'
                                    className="open-web">
                                    <HomeOutlined
                                        className="icon"
                                        style={{ transform: 'translateY(3px)' }}
                                    />
                                    <span className="open-web-title">Open the website</span>
                                </a>
                                <div className="user-admin">
                                    <Avatar size={36} className="avt-admin" src={defaultAvt} />
                                    <span className="user-admin-title">{adminName}</span>
                                </div>
                                <Button onClick={this.onLogout} className="btn-logout" type="dashed">
                                    Đăng xuất
                                </Button>
                            </div>
                        </div>

                        {/* main content */}
                        <div className="d-flex">
                            {/* menu dashboard */}
                            <Menu
                                className="menu"
                                theme="dark"
                                onClick={this.handleSelected}
                                style={{
                                    height: 'inherit',
                                    minHeight: '100vh',
                                    backgroundColor: mainColor,
                                    flexBasis: '200px',
                                }}
                                defaultSelectedKeys={keyMenu}
                                mode="inline">
                                {this.renderMenuItem()}
                            </Menu>

                            {/* main contents */}
                            <div className="flex-grow-1">{this.renderMenuComponent(keyMenu)}</div>
                        </div>
                    </>
                )}
            </div>
        )
    }
}

// Map state từ Redux store vào props của component
const mapStateToProps = state => {
    return {
    };
};

// Map các action creators để dispatch vào props của component
const mapDispatchToProps = dispatch => {
    return {
    };
};

// Kết nối component với Redux store
export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);

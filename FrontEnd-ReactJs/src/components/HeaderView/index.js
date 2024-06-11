import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { AutoComplete, Badge, Button, Dropdown, Input, Menu, Drawer, message } from 'antd';
import { MenuOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined, ReconciliationOutlined } from '@ant-design/icons';
import { PATH } from '../../utils/constant.js';
import { postLogout } from '../../services/loginServices.js';
import Avatar from 'antd/lib/avatar/avatar';
import defaultAvt from '../../assets/imgs/default-avt.png';
import logoUrl from '../../assets/Logo/Logo.png';
import constants from '../../constants/index.js';
import helpers from '../../helpers/index.js';
import CartView from './CartView/index.js'
import authActions from '../../store/actions/authActions.js';
import './index.scss';

class HeaderView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            linkSearch: '',
            isMdDevice: false,
            isSmDevice: false,
            drawerVisible: false,
            carts: [],
            length: 200,
            isMediumDevice: window.innerWidth <= 992,
            isSmallDevice: window.innerWidth <= 480,
        };
        this.onLogout = this.onLogout.bind(this);
        this.totalItemCarts = this.totalItemCarts.bind(this);
    }

    // tính tổng item cart
    totalItemCarts(carts) {
        if (carts) {
            return carts.reduce((total, item) => total + item.amount, 0);
        }
    }

    // đăng xuất
    onLogout = async () => {
        try {
            const response = await postLogout();
            if (response && response.code === 0) {
                message.success('Đăng xuất thành công', 2);
                localStorage.removeItem(constants.REFRESH_TOKEN_KEY);
                localStorage.setItem('nameDB', "null");
                this.props.setIsAuth(false);
            } else {
                message.error(response.message, 2);
            }
        }
        catch (error) {
            message.error('Đăng xuất thất bại', 2);
        }
    }

    componentDidMount() {
        const w = window.innerWidth;
        if (w <= 992) this.setState({ isMdDevice: true });
        if (w <= 480) this.setState({ isSmDevice: true });
        window.addEventListener('resize', this.handleResize);

        // render liên tục để cập nhật sản phẩm trong giỏ hàng
        const cartsFromLocalStorage = JSON.parse(localStorage.getItem('carts'));
        this.setState({ carts: cartsFromLocalStorage });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const width = window.innerWidth;
        this.setState({
            isMediumDevice: width <= 992,
            isSmallDevice: width <= 480,
        });
    };

    // fn: render liên tục
    componentDidUpdate(prevProps) {
        if (this.props.locations !== prevProps.locations) {
            this.setState({ drawerVisible: false });
        }
        // render lại giao diện khi có sự thay đổi giỏ hàng
        if (this.props.carts !== prevProps.carts) {
            this.setState({ carts: this.props.carts })
        }
    }

    // fn: rendering
    render() {
        // const { isAuth, user } = this.props;
        const { isAuth } = this.props;
        const { isMdDevice, isSmDevice, drawerVisible, linkSearch, length } = this.state;
        const options = helpers.autoSearchOptions();
        const locations = this.props.location.pathname;
        const initLink = '/search?keyword=';

        // render bảng tương tác người dùng khi người dùng đăng nhập thành công
        const userActionMenu = (
            <Menu className="m-t-24" style={{ width: 244 }}>
                <Menu.Item>
                    {isAuth ? (
                        <Button onClick={this.onLogout} size="large" className="w-100" type="primary" danger={isAuth}>
                            Đăng xuất
                        </Button>
                    ) : (
                        <Button size="large" className="w-100" type="primary">
                            <Link to={PATH.LOGIN_USER}>Đăng nhập</Link>
                        </Button>
                    )}
                </Menu.Item>
                <Menu.Item>
                    <Link to={PATH.SIGNUP_USER}>
                        <Button size="large" className="w-100 btn-secondary" type="default">
                            Đăng ký
                        </Button>
                    </Link>
                </Menu.Item>
                {isAuth && (
                    <Menu.Item>
                        <Button size="large" className="w-100 btn-secondary" type="default">
                            <Link to={constants.ROUTES.ACCOUNT + '/'}>Quản lý Tài khoản</Link>
                        </Button>
                    </Menu.Item>
                )}
            </Menu>
        );

        return (
            <div className="hd-view" style={{ height: isSmDevice ? 76 : 104 }}>
                <div className="header-content container">

                    <div className='logo'>
                        {/* Logo */}
                        <Link to="/">
                            <img
                                src={logoUrl}
                                width={isSmDevice ? 78 : 112}
                                height={isSmDevice ? 50 : 80}
                                alt="Logo"
                            />
                        </Link>
                    </div>

                    {/* thanh tìm kiếm */}
                    <div className="t-right search-bar-wrapper w-100">
                        <div className="search-bar pos-relative">
                            <AutoComplete
                                className="trans-center w-100"
                                options={options}
                                onChange={(value) =>
                                    this.setState({ linkSearch: helpers.formatQueryString(value) })
                                }
                                filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                            >
                                <Input
                                    className='input_search'
                                    maxLength={length}
                                    size={isSmDevice ? 'middle' : 'large'}
                                    placeholder={!isSmDevice ? 'Nhập từ khoá cần tìm' : 'Tìm kiếm'}
                                />
                            </AutoComplete>

                            <Button
                                type="primary"
                                size={isSmDevice ? 'middle' : 'large'}
                                style={{ borderRadius: 'inherit' }}
                            >
                                <Link to={linkSearch === '' ? locations : initLink + linkSearch}>
                                    <SearchOutlined /> {!isSmDevice ? 'Tìm kiếm' : ''}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* công cụ */}
                    {isMdDevice ? (
                        <>
                            <Drawer
                                title="Menu"
                                placement="right"
                                closable={true}
                                onClose={() => this.setState({ drawerVisible: false })}
                                maskClosable={true}
                                visible={drawerVisible}
                            >
                                <ul className="m-0 d-flex">

                                    {/* Đăng Nhập */}
                                    <li className="li-content">
                                        <Dropdown menu={userActionMenu} placement="bottomLeft">
                                            <Link to={isAuth ? `${constants.ROUTES.ACCOUNT}/` : PATH.LOGIN_USER}>
                                                {!isAuth ? (
                                                    <div className="d-flex navbar-tool-item p-l-0">
                                                        <UserOutlined className="icon m-r-12" />
                                                        <span className="title">Đăng nhập</span>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex navbar-tool-item p-l-0">
                                                        <Avatar src={defaultAvt} className="m-r-12" />
                                                        {/* <span className="title">
                                                            {helpers.reduceProductName(user.fullName, 12)}
                                                        </span> */}
                                                    </div>
                                                )}
                                            </Link>
                                        </Dropdown>
                                    </li>

                                    {/* đơn hàng */}
                                    <li className="li-content">
                                        <Link className="d-flex navbar-tool-item p-l-0" to={constants.ROUTES.ACCOUNT + '/orders'}>
                                            <ReconciliationOutlined className="icon m-r-12" />
                                            <span className="title">Đơn hàng</span>
                                        </Link>
                                    </li>

                                    {/* giỏ hàng */}
                                    <li className="li-content">
                                        <Dropdown
                                            placement="bottomLeft"
                                            arrow
                                            overlayStyle={{ minWidth: '200px' }} // Thêm overlayStyle nếu cần
                                            overlay={<CartView list={this.state.carts} />}
                                        >
                                            <Link
                                                className="d-flex navbar-tool-item p-l-0"
                                                to={constants.ROUTES.CART}>
                                                <ShoppingCartOutlined className="icon m-r-12" />
                                                <Badge className="pos-absolute"
                                                    size="default"
                                                    style={{ color: '#fff' }}
                                                    count={this.totalItemCarts(this.state.carts)}
                                                    overflowCount={9}
                                                    offset={[18, -10]}
                                                />
                                                <span className="title">Giỏ hàng</span>
                                            </Link>
                                        </Dropdown>
                                    </li>
                                </ul>
                            </Drawer>
                            <MenuOutlined className="menu-icon" onClick={() => this.setState({ drawerVisible: true })} />
                        </>
                    ) : (
                        <ul className="d-flex m-0">
                            {/* // Đơn hàng */}
                            <li>
                                <Link className="d-flex flex-direction-column navbar-tool-item p-l-0" to={constants.ROUTES.ACCOUNT + '/orders'}>
                                    <ReconciliationOutlined className="icon" />
                                    <span className="title">Đơn hàng</span>
                                </Link>
                            </li>

                            {/* Đăng nhập khi người dùng chưa đăng nhập */}
                            <li>
                                <Dropdown overlay={userActionMenu} placement="bottomRight">
                                    <Link to={isAuth ? `${constants.ROUTES.ACCOUNT}/` : constants.ROUTES.LOGIN}>
                                        {!isAuth ? (
                                            <div className="d-flex flex-direction-column navbar-tool-item">
                                                <UserOutlined className="icon" />
                                                <span className="title">Đăng nhập</span>
                                            </div>
                                        ) : (
                                            <div className="d-flex flex-direction-column navbar-tool-item">
                                                <Avatar src={defaultAvt} className="m-auto" />
                                                {/* <span className="title">{helpers.reduceProductName(user.fullName, 12)}</span> */}
                                            </div>
                                        )}
                                    </Link>
                                </Dropdown>
                            </li>

                            {/* Giỏ hàng */}
                            <li>
                                <Dropdown
                                    overlay={<CartView list={this.state.carts} />}
                                    placement="bottomRight"
                                    arrow
                                >
                                    <Link
                                        className="d-flex flex-direction-column navbar-tool-item"
                                        to={constants.ROUTES.CART}>
                                        <ShoppingCartOutlined className="icon" />
                                        <Badge
                                            className="pos-absolute"
                                            // size="default"
                                            size="small"
                                            style={{ color: '#fff' }}
                                            count={this.totalItemCarts(this.state.carts)}
                                            overflowCount={9}
                                            offset={[36, -5]}
                                        />
                                        <span className="title">Giỏ hàng</span>
                                    </Link>
                                </Dropdown>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        );
    }
}

// map redux đến react
const mapStateToProps = state => {
    return {
        language: state.app.language,
        isAuth: state.authenticate.isAuth,
        carts: state.cart,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setIsAuth: (isAuth) => dispatch(authActions.setIsAuth(isAuth))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderView));

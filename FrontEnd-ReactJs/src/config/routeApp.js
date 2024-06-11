import React from 'react';
import { Route } from 'react-router-dom';
import { PATH } from "../utils";
import constants from '../constants/index.js';

// các giao diện
import HomePage from "../containers/Home_User/HomePage_User";
import LOGIN from "../containers/Home_User/Login_Signup_User/Login_User/index.js";
import SIGNUP from "../containers/Home_User/Login_Signup_User/SignUp_User/SignUp_User";
import ForgotPassword from '../containers/Home_User/Login_Signup_User/ForgotPassword/ForgotPassword.js';
import NotFound from '../components/NotFound/NotFound.js';
import AccountPage from '../containers/AccountPage/index.js';
import Cart from '../components/Carts/index.js';
import PaymentPage from '../containers/PaymentPage/index.js';
import ProductDetailPage from '../containers/ProductDetailPage/index.js';
import SearchResult from '../containers/SearchFilterPage/Search/index.js';
import FilterResult from '../containers/SearchFilterPage/Filter/index.js';

const routes = [
    {
        path: PATH.LOGIN_USER,
        exact: true,
        main: () => <LOGIN />
    },
    {
        path: PATH.SIGNUP_USER,
        exact: true,
        main: () => <SIGNUP />
    },
    {
        path: PATH.FORGOTPASSWORD,
        exact: true,
        main: () => <ForgotPassword />
    },
    {
        path: PATH.HOME,
        exact: true,
        main: () => <HomePage />
    },
    {
        path: constants.ROUTES.PRODUCT,
        exact: false,
        main: () => <ProductDetailPage />
    },
    {
        path: PATH.NOT_FOUND,
        exact: true,
        main: () => <NotFound />,
    },
    {
        path: constants.ROUTES.CART,
        exact: true,
        main: () => <Cart list={[]} />,
    },
    {
        path: constants.ROUTES.PAYMENT,
        exact: true,
        main: () => <PaymentPage />,
    },
    {
        path: constants.ROUTES.ACCOUNT,
        exact: false,
        main: () => <AccountPage />,
    },
    {
        path: constants.ROUTES.SEARCH,
        exact: false,
        main: () => <SearchResult />,
    },
    {
        path: constants.ROUTES.FILTER,
        exact: true,
        main: () => <FilterResult />,
    },
];

const renderRoutes = (routes) => {
    return routes.map((route, index) => {
        const { path, exact, main } = route;
        return <Route key={index} path={path} exact={exact} component={main} />
    })
};

const routeConfig = {
    routes,
    renderRoutes,
};

export default routeConfig;
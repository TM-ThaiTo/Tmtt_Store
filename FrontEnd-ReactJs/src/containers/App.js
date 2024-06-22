// App.js
import React, { Component, Fragment, Suspense } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// các route
import routesConfig from '../config/routeApp.js';
import { PATH } from '../utils/constant.js';
// các giao diện
import AdminPage from './AdminPage/index.js';
import NotFound from '../components/NotFound/NotFound.js';
import GlobalLoading from '../components/Loading/Global/index.js';
import HeaderView from '../components/HeaderView/index.js';
import ContactIcon from '../components/ContactIcon/index.js';
import CustomScrollbars from '../components/Custom/ScrollBar/index.js';
import Footer from './Home_User/Footer/Footer.js';
import authActions from '../store/actions/authActions.js';
import userActions from '../store/actions/userActions.js';
import authReducer from '../store/reducers/authReducer.js';

class App extends Component {
    state = {
        isAdminLoggedIn: false,
    };

    // fn: hàm gọi và update đầu tiên
    componentDidMount() {
        localStorage.setItem('nameDB', "null");
        this.props.getIsAuth();
    }

    // fn: hàm bắt sự kiện thay đổi
    componentDidUpdate(prevProps) {
        if (this.props.isAuth && !prevProps.isAuth) {
            this.props.getUserRequest();
        }
    }

    // fn: rendering
    render() {
        const { isAuth } = this.props;
        const routes = routesConfig.routes(isAuth);
        const renderRoutes = routesConfig.renderRoutes;
        const isUserRoute = !window.location.pathname.startsWith(PATH.ADMIN);
        return (
            <Fragment>
                <BrowserRouter>
                    <div className="App" id="app">
                        <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                            <Suspense fallback={<GlobalLoading />}>

                                {/* route ADMIN */}
                                <Switch>
                                    <Route path={PATH.ADMIN} exact component={AdminPage} />
                                </Switch>

                                {/* route USER */}
                                {isUserRoute && (
                                    <>
                                        <HeaderView />
                                        <ContactIcon />
                                        <Switch>
                                            {renderRoutes(routes)}
                                            <Route>
                                                <NotFound />
                                            </Route>
                                        </Switch>
                                        <Footer />
                                    </>
                                )}
                            </Suspense>
                        </CustomScrollbars>
                    </div>
                </BrowserRouter>
            </Fragment>
        )
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
        getIsAuth: () => dispatch(authActions.getIsAuth()),
        setIsAuth: (isAuth) => dispatch(authReducer.setIsAuth(isAuth)),
        getUserRequest: () => dispatch(userActions.getUserRequest()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

// protectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, isAuth, redirectTo, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuth ? <Redirect to={redirectTo} /> : <Component {...props} />
        }
    />
);

export default ProtectedRoute;

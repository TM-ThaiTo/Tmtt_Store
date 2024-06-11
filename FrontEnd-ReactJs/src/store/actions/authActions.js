import { getAuth, postRefreshToken } from '../../services/loginServices.js';
import constants from '../../constants/index.js';
import actionTypes from '../actions/actionTypes.js';

// Constants

// Action Creators
const setIsAuth = (isAuth) => {
    return {
        type: actionTypes.SET_IS_AUTH, // Use actionTypes.SET_IS_AUTH
        payload: { isAuth }
    };
};

// refresh Token 
const refreshToken = () => {
    return async (dispatch) => {
        try {
            const refToken = localStorage.getItem(constants.REFRESH_TOKEN_KEY);
            if (!refToken) {
                return dispatch(setIsAuth(false));
            }
            const result = await postRefreshToken({
                refresh_token: refToken,
            });
            if (result.status === 200) {
                dispatch(setIsAuth(true));
            } else {
                dispatch(setIsAuth(false));
            }
        } catch (error) {
            dispatch(setIsAuth(false));
        }
    };
};

const getIsAuth = () => {
    return async (dispatch) => {
        try {
            const result = await getAuth();
            dispatch(setIsAuth(result.isAuth));
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    dispatch(refreshToken());
                }
            } else {
                dispatch(setIsAuth(false));
            }
        }
    };
};

const authActions = {
    setIsAuth,
    getIsAuth,
};
export default authActions;

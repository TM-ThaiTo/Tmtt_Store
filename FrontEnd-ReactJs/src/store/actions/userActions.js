//======= imports =======//
import { getUserApi } from '../../services/userService';
import actionTypes from './actionTypes';

//======= actions request (call API) =======//
const getUserRequest = () => {
    return async (dispatch) => {
        try {
            const response = await getUserApi();
            const user = response.data;
            dispatch(getUser(user));
        } catch (error) {
            throw error;
        }
    };
};

//======= actions =======//
const getUser = (user) => {
    return {
        type: actionTypes.GET_USER,
        payload: user,
    };
};

//======= exports =======//
const userActions = {
    getUserRequest,
    getUser,
};

export default userActions;



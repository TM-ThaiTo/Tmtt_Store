import actionTypes from '../actions/actionTypes';

const initialState = { isAuth: false };

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_IS_AUTH:
            const { isAuth } = action.payload;
            return { ...state, isAuth };
        default:
            return state;
    }
};

export default authReducer;

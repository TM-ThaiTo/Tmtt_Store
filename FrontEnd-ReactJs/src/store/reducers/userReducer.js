//======= constant action type =======//
import actionTypes from '../actions/actionTypes';

//======= initial state =======//
const initialState = {};

//======= reducer =======//
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_USER: {
            return { ...action.payload };
        }
        default:
            return { ...state };
    }
};

//======= exports =======//
export default userReducer;

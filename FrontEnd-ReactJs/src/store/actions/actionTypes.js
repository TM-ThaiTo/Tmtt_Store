const actionTypes = Object.freeze({
    //app
    APP_START_UP_COMPLETE: 'APP_START_UP_COMPLETE',
    SET_CONTENT_OF_CONFIRM_MODAL: 'SET_CONTENT_OF_CONFIRM_MODAL',

    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',

    //user
    ADD_USER_SUCCESS: 'ADD_USER_SUCCESS',

    USER_LOGIN_SUCCESS: "USER_LOGIN_SUCCESS",
    USER_LOGIN_FAIL: "USER_LOGIN_FAIL",
    PROCESS_LOGOUT: 'PROCESS_LOGOUT',

    //admin
    FETCH_GENDER_START: 'FETCH_GENDER_START',
    FETCH_GENDER_SUCCES: 'FETCH_GENDER_SUCCES',
    FETCH_GENDER_FAILED: 'FETCH_GENDER_FAILED',

    FETCH_POSITION_START: 'FETCH_POSITION_START',
    FETCH_POSITION_SUCCESS: 'FETCH_POSITION_SUCCES',
    FETCH_POSITION_FAILED: 'FETCH_POSITION_FAILED',

    FETCH_ROLE_START: 'FETCH_ROLE_START',
    FETCH_ROLE_SUCCESS: 'FETCH_ROLE_SUCCES',
    FETCH_ROLE_FAILED: 'FETCH_ROLE_FAILED',

    // create user
    CREATE_USER_START: 'CREATE_USER_START',
    CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
    CREATE_USER_FAILED: 'CREATE_USER_FAILED',

    // read user
    FETCH_ALL_USERS_START: 'FETCH_ALL_USERS_START',
    FETCH_ALL_USERS_SUCCESS: 'FETCH_ALL_USERS_SUCCES',
    FETCH_ALL_USERS_FAILED: 'FETCH_ALL_USERS_FAILED',

    // edit user
    EDIT_USER_START: 'EDIT_USER_START',
    EDIT_USER_SUCCESS: 'EDIT_USER_SUCCESS',
    EDIT_USER_FAILED: 'EDIT_USER_FAILED',

    // delete user
    DELETE_USER_START: 'DELETE_USER_START',
    DELETE_USER_SUCCESS: 'DELETE_USER_SUCCESS',
    DELETE_USER_FAILED: 'DELETE_USER_FAILED',

    // carts 
    ADD_PRODUCT: 'ADD_PRODUCT',
    RESET_CART: 'RESET_CART',
    DEL_CART_ITEM: 'DEL_CART_ITEM',
    UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',

    // auths
    GET_IS_AUTH: 'GET_IS_AUTH',
    SET_IS_AUTH: 'SET_IS_AUTH',

    // user
    GET_USER: 'GET_USER',

})

export default actionTypes;
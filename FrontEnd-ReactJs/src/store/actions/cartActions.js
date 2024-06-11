import actionTypes from "./actionTypes";

const addToCart = (item) => {
    return {
        type: actionTypes.ADD_PRODUCT,
        payload: item,
    };
};

const resetCart = () => {
    return {
        type: actionTypes.RESET_CART,
    };
};

const delCartItem = (index) => {
    return {
        type: actionTypes.DEL_CART_ITEM,
        payload: index,
    };
};

const updateCartItem = (index, value) => {
    return {
        type: actionTypes.UPDATE_CART_ITEM,
        payload: { index, value },
    };
};
const cartActions = {
    addToCart,
    resetCart,
    delCartItem,
    updateCartItem
};

export default cartActions;

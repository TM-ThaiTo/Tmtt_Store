import { message } from 'antd';
import constants from '../../constants';
import actionTypes from '../actions/actionTypes';

const carts = JSON.parse(localStorage.getItem(constants.CARTS));
const initialState = carts ? carts : [];

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        // thêm sản phẩm vào giỏ hàng
        case actionTypes.ADD_PRODUCT: {
            const item = action.payload;
            let newCart = [...state];
            let isExist = false;
            for (let i = 0; i < newCart.length; ++i) {
                if (newCart[i].code === item.code) {
                    newCart[i].amount += item.amount;
                    isExist = true;
                    break;
                }
            }
            if (!isExist) newCart = [...newCart, item];
            localStorage.setItem(constants.CARTS, JSON.stringify(newCart));
            return [...newCart];
        }
        // xoá tất cả trong giỏ hàng
        case actionTypes.RESET_CART: {
            localStorage.removeItem(constants.CARTS);
            return [];
        }
        // xoá một sản phẩm
        case actionTypes.DEL_CART_ITEM: {
            const index = action.payload;
            let newCart = [
                ...state.slice(0, index),
                ...state.slice(index + 1, state.length),
            ];
            localStorage.setItem(constants.CARTS, JSON.stringify(newCart));
            message.success("Đã xoá sản phẩm");
            return [...newCart];
        }
        // update thông tin 1 sản phẩm trong giỏ hàng 
        case actionTypes.UPDATE_CART_ITEM: {
            const { index, value } = action.payload;
            let newCart = state.map((item, i) =>
                i === index ? { ...item, amount: value } : { ...item },
            );
            localStorage.setItem(constants.CARTS, JSON.stringify(newCart));
            message.success("Đã update số lượng sản phẩm");
            return [...newCart];
        }
        default:
            return [...state];
    }
};
export default cartReducer;

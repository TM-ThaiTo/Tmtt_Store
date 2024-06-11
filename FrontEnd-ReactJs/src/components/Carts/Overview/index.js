import React, { Component } from 'react';
import CartItem from './CartItem';
import './index.scss';

class CartOverview extends Component {

    // event: cập nhật lại cart khi có sự thay đổi
    componentDidUpdate() {
        const cartsFromLocalStorage = JSON.parse(localStorage.getItem('carts'));
        const cartsString = JSON.stringify(this.props.carts);
        const cartsFromLocalStorageString = JSON.stringify(cartsFromLocalStorage);

        if (cartsString !== cartsFromLocalStorageString) {
            this.setState({ carts: cartsFromLocalStorage });
        }
    }

    render() {
        const { delCartItem, updateCartItem } = this.props; // Destructure props
        const { carts } = this.props; // Access carts from state
        return (
            <>
                {carts.map((item, index) => (
                    <div key={index} className="m-b-12">
                        <CartItem
                            index={index}
                            {...item}
                            onDelCartItem={delCartItem}
                            onUpdateNumOfProd={updateCartItem}
                        />
                    </div>
                ))}
            </>
        );
    }
}
export default CartOverview;

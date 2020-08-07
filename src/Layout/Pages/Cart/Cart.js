import React from 'react';
import './Cart.css';
import CartCard from '../../Components/Cart-card/Cart-card';


export default class Cart extends React.Component{
    render(){
        return(
            <div className="cart-cont">
                <div className="blank"></div>
                <div className="cart">
                    <div className="cart-head">
                        <h2>SHOPPING CART</h2>
                        <i className="fa fa-times fa-1x"></i>
                    </div>
                    <div className="card-body">
                        <CartCard/>
                    </div>
                </div>
            </div>
        )
    }
}
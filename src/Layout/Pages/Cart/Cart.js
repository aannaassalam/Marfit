import React from 'react';
import './Cart.css';
import CartCard from '../../Components/Cart-card/Cart-card';
import discount from './assets/download.png';


export default class Cart extends React.Component{

    handleCross = () => {
        document.getElementsByClassName("cart-cont")[0].style.display = "none";
    }

    render(){
        return(
            <div className="cart-cont">
                <div className="blank"></div>
                <div className="cart">
                    <div className="cart-head">
                        <h2>SHOPPING CART</h2>
                        <i className="fa fa-times fa-1x" onClick={this.handleCross} ></i>
                    </div>
                    <div className="cart-body">
                        <CartCard/>
                        <CartCard/>
                        <CartCard/>
                        <CartCard/>
                        <CartCard/>
                    </div>
                    <div className="cart-checkout">
                        <div className="apply-coupon">
                            <h3>APPLY COUPON</h3>
                            <input type="text" name="coupon" id="coupon" placeholder="Example: ABCD"/>
                            <div className="avail-coupon">
                                <p>Available Coupons</p>
                                <div className="coupon-selector">
                                    <div className="coupon-title">
                                        <img src={discount} alt="discount image"/>
                                        <div className="paragraphs">
                                            <p className="coupon-name">FIRST10</p>
                                            <p className="coupon-details">(get 10% off on first order)</p>
                                        </div>
                                    </div>
                                    <input type="radio" name="coupon-select" id="selector"/>
                                </div>

                                <div className="coupon-selector">
                                    <div className="coupon-title">
                                        <img src={discount} alt="discount image"/>
                                        <div className="paragraphs">
                                            <p className="coupon-name">FIRST10</p>
                                            <p className="coupon-details">(get 10% off on first order)</p>
                                        </div>
                                    </div>
                                    <input type="radio" name="coupon-select" id="selector"/>
                                </div>
                            </div>
                        </div>
                        <button className="checkout">
                            <a href="#" className="checkout-btn">CHECKOUT . &#8377;999</a>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
import React from "react";
import "./Cart.css";
import CartCard from "../../components/cart-card/Cart-card";
import discount from "../../../assets/download.png";
import firebase from "firebase";

export default class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("users")
      .where("email", "==", this.props.email)
      .onSnapshot((snap) => {
        snap.docs.forEach((doc) => {
          this.setState({
            cart: doc.data().cart,
          });
          console.log(this.state.cart);
        });
      });
  }

  render() {
    return (
      <div className="cart-cont">
        <div className="blank" onClick={this.props.close}></div>
        <div className="cart">
          <div className="cart-head">
            <h2>SHOPPING CART</h2>
            <i className="fa fa-times fa-1x" onClick={this.props.close}></i>
          </div>
          <div className="cart-body">
            {this.state.cart ? (
              this.state.cart.map((items) => {
                return <CartCard image={items.images} title={items.title} price={items.price} />;
              })
            ) : (
              <p>NO ITEMS</p>
            )}
          </div>
          <div className="cart-checkout">
            <div className="apply-coupon">
              <h3>APPLY COUPON</h3>
              <input
                type="text"
                name="coupon"
                id="coupon"
                placeholder="Example: ABCD"
              />
              <div className="avail-coupon">
                <p>Available Coupons</p>
                <div className="coupon-selector">
                  <div className="coupon-title">
                    <img src={discount} alt="discount image" />
                    <div className="paragraphs">
                      <p className="coupon-name">FIRST10</p>
                      <p className="coupon-details">
                        (get 10% off on first order)
                      </p>
                    </div>
                  </div>
                  <input type="radio" name="coupon-select" id="selector" />
                </div>

                <div className="coupon-selector">
                  <div className="coupon-title">
                    <img src={discount} alt="discount image" />
                    <div className="paragraphs">
                      <p className="coupon-name">FIRST10</p>
                      <p className="coupon-details">
                        (get 10% off on first order)
                      </p>
                    </div>
                  </div>
                  <input type="radio" name="coupon-select" id="selector" />
                </div>
              </div>
            </div>
            <button className="checkout">
              <a href="#" className="checkout-btn">
                CHECKOUT . &#8377;999
              </a>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

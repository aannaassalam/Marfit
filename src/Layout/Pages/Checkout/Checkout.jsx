import React from "react";
import "./Checkout.css";
import firebase from "firebase";
import Login from "../../Components/login/Login";

export default class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      openLogin: false,
      coupon: ""
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .firestore()
          .collection("users")
          .where("email", "==", user.email)
          .get()
          .then((snap) => {
            snap.forEach((doc) => {
              this.setState({
                cart: doc.data().cart,
              });
              console.log(doc.data().cart);
            });
          });
      } else {
        this.setState({
          cart: JSON.parse(localStorage.getItem("cart")),
        });
      }
    });
    firebase.firestore().collection('settings').get().then((snap)=>{
      snap.forEach(doc => {
        var coupons = doc.data().coupons;
        coupons.forEach(coupon => {
          if(coupon.name === this.props.match.params.coupon){
            this.setState({
              coupon: coupon
            });
          }
        }
        )
      })
    })
  }

  render() {
    var subTotal = 0;
    var shipping = 0;
    for (var i = 0; i < this.state.cart.length; i++) {
      subTotal += this.state.cart[i].sp * this.state.cart[i].cartQuantity;
      shipping += this.state.cart[i].shippingCharge * this.state.cart[i].cartQuantity;
    }
    var total = shipping + subTotal;
    var value = "";
    var date = new Date();
    if(this.state.coupon !== ""){
      if(this.state.coupon.start.toDate()< date && this.state.coupon.end.toDate()>date){
      if (this.state.coupon.type === "money") {
        total -= this.state.coupon.value;
        value = this.state.coupon.value;
      } else {
        value = total * (this.state.coupon.value / 100);
        total -= value;
      }
    }
    }
    return (
      <div className="checkout">
        <div className="left">
          <div className="already">
            <p>
              Already have an account?{" "}
              <span onClick={() => this.setState({ openLogin: true })}>
                Log in
              </span>
            </p>
          </div>
          <main className="info">
            <div className="contact">
              <div className="contact-label">
                <p className="heading">Contact information</p>
              </div>
              <input
                type="email"
                className="email-input"
                placeholder="Email"
                name="email"
              />
            </div>
            <div className="shipping">
              <h2>Shipping address</h2>
              <div className="input-name">
                <input
                  type="text"
                  placeholder="First name"
                  name="firstName"
                  id="firstName"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  name="lastName"
                  id="lastName"
                />
              </div>
              <input
                type="text"
                placeholder="Address"
                name="address"
                id="address"
              />
              <input
                type="text"
                placeholder="Appartment, suite, etc. (optional)"
                name="appartment"
                id="appartment"
              />
              <div className="region">
                <select name="country" id="country">
                  <option value="">--SELECT--</option>
                  <option value="India">India</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Bangladesh">Bangladesh</option>
                </select>
                <select name="state" id="state">
                  <option value="">--SELECT--</option>
                  <option value="West Bengal">West Benagal</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Odhissa">Odhissa</option>
                </select>
              </div>
              <input type="text" placeholder="City" name="city" id="city" />
              <input
                type="text"
                name="phone"
                id="phone"
                maxLength="10"
                placeholder="Phone"
              />
            </div>
          </main>
          <div className="placeOrder">
            <a>
              <i className="fas fa-chevron-left"></i>Return to cart
            </a>
            <div className="checkoutbtn">
              <a>Place an Order</a>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="items-container">
            {this.state.cart.map((item, index) => (
              <div className="item" key={index}>
                <img src={item.images[0]} alt="Item Image" />
                <div className="item-info">
                  <p>{item.title}</p>
                  <div className="price-cont">
                    <p>&#8377; {item.sp}</p>
                    <p>Quantity: {item.cartQuantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="discount-sec">
            <input
              type="text"
              name="discount"
              id="discount"
              placeholder="Discount Code"
            />
            <button type="button">APPLY</button>
          </div> */}
          <div className="order-details">
            <div className="sub">
              <p className="sub-title">Subtotal</p>
              <p>&#8377; {subTotal}</p>
            </div>
            <div className="shipping-sub">
              <p className="sub-title">Shipping</p>
              <p>+ &#8377; {shipping}</p>
            </div>
            <div className="discount-sub">
              <p className="sub-title">Discount ({this.state.coupon.name})</p>
              <p>- &#8377; {value}</p>
            </div>
          </div>
          <div className="total">
            <p>TOTAL</p>
            <p>&#8377; {total}</p>
          </div>
        </div>
        {this.state.openLogin ? (
          <Login close={(toggle) => this.setState({ openLogin: toggle })} />
        ) : null}
      </div>
    );
  }
}

import React from "react";
import "./Cart.css";
import CartCard from "../../Components/Cart-card/Cart-card";
import discount from "../../../assets/download.png";
import firebase from "firebase";
import empty from "./629-empty-box.json";
import Lottie from "lottie-react-web";

export default class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      coupons: [],
      selectedCoupon: "",
    };
  }

  componentDidMount() {
    if (this.props.email) {
      firebase
        .firestore()
        .collection("users")
        .where("email", "==", this.props.email)
        .onSnapshot((snap) => {
          snap.docChanges().forEach((change) => {
            this.setState({
              cart: change.doc.data().cart,
            });
          });
        });
    } else {
      var cart = JSON.parse(localStorage.getItem("cart"));
      this.setState({
        cart: cart ? cart : [],
      });
    }
    firebase
      .firestore()
      .collection("settings")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          this.setState({
            coupons: doc.data().coupons,
          });
        });
      });
  }

  handleChange(e) {
    this.setState({
      selectedCoupon: this.state.coupons[e.target.value],
    });
    console.log(this.state.selectedCoupon);
  }

  removeFromCart = (id) => {
    this.setState({
      addLoading: true,
    });
    if (firebase.auth().currentUser) {
      firebase
        .firestore()
        .collection("users")
        .where("email", "==", firebase.auth().currentUser.email)
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            var cart = doc.data().cart;
            var newCart = cart.filter((item) => {
              return item.id !== id;
            });
            firebase
              .firestore()
              .collection("users")
              .doc(doc.id)
              .update({
                cart: newCart,
              })
              .then(() => {
                this.setState({
                  cart: newCart,
                });
              });
          });
        });
    } else {
      var cart = JSON.parse(localStorage.getItem("cart"));
      var newCart = [];
      cart.forEach((car) => {
        if (car.id !== id) {
          newCart.push(car);
        }
      });
      this.setState({
        cart: newCart,
      });
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    }
  };

  handleminus = (id) => {
    if (firebase.auth().currentUser) {
      firebase
        .firestore()
        .collection("users")
        .where("email", "==", firebase.auth().currentUser.email)
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            var cart = doc.data().cart;
            cart.map((item) => {
              if (item.id === id) {
                if (item.cartQuantity > 1) {
                  item.cartQuantity -= 1;
                } else {
                  this.removeFromCart(id);
                }
              }
            });
            firebase.firestore().collection("users").doc(doc.id).update({
              cart: cart,
            });
          });
        });
    } else {
      var cart = this.state.cart;
      cart.forEach((item) => {
        if (item.id === id) {
          if (item.cartQuantity > 1) {
            item.cartQuantity -= 1;
          } else {
            var newCart = this.removeFromCart(id);
            cart = newCart;
          }
        }
      });
      this.setState({
        cart: cart,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  handleplus = (id) => {
    if (firebase.auth().currentUser) {
      firebase
        .firestore()
        .collection("users")
        .where("email", "==", firebase.auth().currentUser.email)
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            var cart = doc.data().cart;
            cart.forEach((item) => {
              if (item.id === id) {
                item.cartQuantity += 1;
              }
            });

            firebase.firestore().collection("users").doc(doc.id).update({
              cart: cart,
            });
          });
        });
    } else {
      var cart = this.state.cart;
      cart.forEach((item) => {
        if (item.id === id) {
          item.cartQuantity += 1;
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      this.setState({
        cart: cart,
      });
    }
  };

  render() {
    var total = 0;
    var i = 0;
    if (this.state.cart.length > 0) {
      this.state.cart.map((item) => (total += item.sp * item.cartQuantity));
    }
    if (this.state.selectedCoupon !== "") {
      if (this.state.selectedCoupon.type === "money") {
        total -= this.state.selectedCoupon.value;
      } else {
        total -= total * (this.state.selectedCoupon.value / 100);
      }
    }

    return (
      <div className="cart-cont">
        <div className="blank" onClick={this.props.close}></div>
        <div className="cart">
          <div className="cart-head">
            <h2>SHOPPING CART</h2>
            <i className="fa fa-times fa-1x" onClick={this.props.close}></i>
          </div>
          <div className="cart-body">
            {this.state.cart.length > 0 ? (
              this.state.cart.map((item, index) => (
                <div className="list" key={index}>
                  <CartCard
                    item={item}
                    removeFromCart={(e) => {
                      this.removeFromCart(e);
                    }}
                    handleplus={() => {
                      this.handleplus(item.id);
                    }}
                    handleminus={() => {
                      this.handleminus(item.id);
                    }}
                    id={index}
                  />
                </div>
              ))
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "40vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Lottie
                  options={{ animationData: empty }}
                  width={150}
                  height={150}
                />
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#313131",
                  }}
                >
                  No items in cart
                </p>
              </div>
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
                {this.state.coupons.map((item, index) => {
                  var date = new Date();
                  if (item.start.toDate() < date && item.end.toDate() > date) {
                    return (
                      <div className="coupon-selector" key={index}>
                        <div className="coupon-title">
                          <img src={item.image} alt="discount image" />
                          <div className="paragraphs">
                            <p className="coupon-name">{item.name}</p>
                            <p className="coupon-details">
                              ({item.description})
                            </p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="coupon-select"
                          id="selector"
                          value={index}
                          onChange={(e) => this.handleChange(e)}
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            {this.state.cart.length > 0 ? (
              <button className="checkout-btn">
                <a
                  href={
                    "/Cart/Checkout/coupon:" + this.state.selectedCoupon.name
                  }
                >
                  CHECKOUT . &#8377;{total}
                </a>
              </button>
            ) : (
              <button className="checkout-btn-disabled">
                <p>CHECKOUT</p>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

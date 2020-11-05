import React from "react";
import "./ByeNow.css";
import firebase from "firebase";
import Login from "../../Components/Login/Login";
import toaster from "toasted-notes";
import loading from "../../../assets/loading.json";
import Lottie from "lottie-react-web";
import Loader from "../../Components/Loader/Loader";
import CartCard from "../../Components/Cart-card/Cart-card";

export default class ByeNow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openLogin: false,
      coupon: "",
      currentUser: "",
      loginStatus: "",
      email: "",
      addresses: [],
      address: "",
      phone: "",
      state: "",
      country: "",
      firstName: "",
      lastName: "",
      appartment: "",
      city: "",
      pincode: "",
      points: "",
      userID: "",
      loading: true,
      product: "",
      selectedAddress: null,
      addAddress: false,
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
              console.log(doc.data())
              if(doc.data().addresses.length === 0){
                this.setState({
                  addAddress: true
                })
              }
              this.setState(
                {
                  currentUser: doc.data(),
                  email: doc.data().email,
                  addresses: doc.data().addresses,
                  phone: doc.data().phone,
                  points: doc.data().points,
                  userID: doc.id,
                },
                () => {
                    firebase.firestore().collection("products").doc(this.props.match.params.item).onSnapshot(doc => {
                      var product = doc.data();
                      product.id = doc.id;
                      product.quantity = this.props.match.params.quantity;
                      console.log(product);
                      this.setState({
                        product: product
                      })
                    })
                    this.state.currentUser.name.includes(" ")
                      ? this.setState({
                          //first name
                          firstName: this.state.currentUser.name.substr(
                            0,
                            this.state.currentUser.name.indexOf(" ")
                          ),
                          //last name
                          lastName: this.state.currentUser.name.substr(
                            this.state.currentUser.name.indexOf(" "),
                            this.state.currentUser.name.length
                          ),
                          loading: false,
                        })
                      : this.setState({
                          firstName: this.state.currentUser.name,
                          loading: false,
                        });
                }
              );
            });
          });
      } else {
        firebase.firestore().collection("products").doc(this.props.match.params.item).onSnapshot(doc => {
          var product = doc.data();
          product.id = doc.id;
          product.quantity = this.props.match.params.quantity;
          this.setState({
            product: product,
            points: 0,
            userID: "",
            loading: false,
            addAddress: true
          })
        })
      };
        })
      }

  handlePay = async (total, subtotal, shipping) => {
    var userExist = false;
    if (this.state.currentUser.length === 0) {
      await firebase.firestore().collection("users").where("email", "==", this.state.email).get().then(() => {
        userExist = true;
      })
    }
    if (!userExist) {
      if (
        this.state.email.length > 0 &&
        this.state.country.length > 0 &&
        this.state.state.length > 0 &&
        this.state.phone.length > 0 &&
        this.state.address.length > 0 &&
        this.state.city.length > 0 &&
        this.state.pincode.length > 0 &&
        this.state.firstName.length > 0
      ) {
        var product = this.state.product;
        product.rate = false;
        firebase
          .firestore()
          .collection("orders")
          .add({
            products: [product],
            date: new Date(),
            email: this.state.email,
            points: this.state.points,
            address: this.state.address,
            appartment: this.state.appartment,
            city: this.state.city,
            country: this.state.country,
            pincode: this.state.pincode,
            phone: this.state.phone,
            state: this.state.state,
            coupon: this.state.coupon,
            name: this.state.firstName + " " + this.state.lastName,
            total: total,
            shipping: shipping,
            tag: "guest",
            status: "Pending",
          })
          .then((res) => {
            if (this.state.currentUser.email) {
              firebase
                .firestore()
                .collection("users")
                .doc(this.state.userID)
                .get()
                .then((doc) => {
                  var addresses = doc.data().addresses;
                  if (this.state.addAddress) {
                    var address = {
                      address: this.state.address,
                      email: this.state.email,
                      phone: this.state.phone,
                      state: this.state.state,
                      country: this.state.country,
                      firstName: this.state.firstName,
                      lastName: this.state.lastName,
                      appartment: this.state.appartment,
                      city: this.state.city,
                      pincode: this.state.pincode,
                    };
                    console.log(address)
                    addresses.push(address);
                  }
                  var orders = doc.data().orders;
                  orders.push(res.id);
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(this.state.userID)
                    .update({
                      orders: orders,
                      addresses: addresses,
                      points: 0,
                    })
                    .then(() => {
                      window.location.href = "/Orders/" + res.id;
                    });
                });
            } else {
              window.location.href = "/Orders/" + res.id; 
            }
          });
        //   const options = {
        //     key: "rzp_test_GLsJlJZsykHTEw",
        //     name: "Marfit",
        //     amount: total * 100,
        //     handler: async (response) => {
        //       try {
        //         // firebase
        //         //   .firestore()
        //         //   .collection("payments")
        //         //   .add({
        //         //     name: this.state.name,
        //         //     phone: this.state.phone,
        //         //     email: this.state.email,
        //         //     paymentId: response.razorpay_payment_id,
        //         //     amount: this.state.amount,
        //         //   })
        //         // .then(() => {
        //         var product = this.state.product;
        //         product.rate = false;
        //         firebase
        //           .firestore()
        //           .collection("orders")
        //           .add({
        //             products: [product],
        //             date: new Date(),
        //             points: this.state.points,
        //             user: this.state.userID,
        //             address: this.state.address,
        //             appartment: this.state.appartment,
        //             city: this.state.city,
        //             country: this.state.country,
        //             pincode: this.state.pincode,
        //             phone: this.state.phone,
        //             state: this.state.state,
        //             coupon: this.state.coupon,
        //             total: total,
        //             shipping: shipping,
        //             tag: "user",
        //             status: "Pending",
        //           })
        //           .then((res) => {
        //             if(this.state.currentUser.length > 0){
        //               firebase
        //               .firestore()
        //               .collection("users")
        //               .doc(this.state.userID)
        //               .get()
        //               .then((doc) => {
        //                 var orders = doc.data().orders;
        //                 orders.push(res.id);
        //                 firebase
        //                   .firestore()
        //                   .collection("users")
        //                   .doc(this.state.userID)
        //                   .update({
        //                     orders: orders,
        //                     points: 0,
        //                   })
        //                   .then(() => {
        //                     window.location.href = "/Orders/" + res.id;
        //                   });
        //               });
        //             }else{
        //                 firebase
        //                   .firestore()
        //                   .collection("users")
        //                   .add({
        //                     orders: [res.id],
        //                     email: this.state.email,
        //                     phone: this.state.phone,
        //                     name: this.state.firstName + " " + this.state.lastName
        //                   })
        //                   .then(() => {
        //                     window.location.href = "/Orders/" + res.id;
        //                   });
        //             }
        //           });
        //         // });
        //       } catch (err) {
        //         toaster.notify("Oops! Something went wrong");
        //       }
        //     },
        //     prefill: {
        //       name: this.state.firstName,
        //       email: this.state.email,
        //       contact: this.state.phone,
        //     },
        //     theme: {
        //       color: "#2D499B",
        //     },
        //   };
        //   const rzp1 = new window.Razorpay(options);
        //   rzp1.open();
        // } 
      } else {
        if (!this.state.addAddress) {
          toaster.notify("Please select any address");
        }
        else {
          toaster.notify("Please Fill in all the fields");
        }
      }
    } else {
      toaster.notify("User already exist! please Log in");
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleAddress = (index) => {
    var address = this.state.addresses[index];
    this.setState({
      phone: address.phone,
      state: address.state,
      country: address.country,
      firstName: address.firstName,
      lastName: address.lastName,
      appartment: address.appartment,
      city: address.city,
      pincode: address.pincode,
      email: address.email,
      address: address.address,
      selectedAddress: index
    })
  }

  render() {
    var subtotal = this.state.product.sp;
    var shipping = this.state.product.shippingCharge * this.props.match.params.quantity;
    var total = subtotal + shipping;
    
    return (
      <div className="checkout">
        {this.state.loading ? (
          <Loader />
        ) : (
          <>
            <div className="left">
              {this.state.currentUser !== "" ? null : (
                <div className="already">
                  <p>
                    Already have an account?{" "}
                    <span onClick={() => this.setState({ openLogin: true })}>
                      Log in
                    </span>
                  </p>
                </div>
              )}

              <main className="info">
                {
                  !this.state.addAddress ? 
                    <div className="addressInput">
                      {this.state.addresses.map((address, index) => {
                              if(this.state.selectedAddress === index){
                                return(
                                <div className="address selected" key={index} onClick={() => this.handleAddress(index)}>
                                  <div className="paras">
                                    <p>Address {index + 1} :</p>
                                    <p>
                                      {address.firstName} {address.lastName}
                                    </p>
                                    <p>{address.address}</p>
                                  </div>
                                  <div className="circle">
                                  </div>
                                </div>
                                )
                              }else{
                                return(
                                  <div className="address" key={index} onClick={() => this.handleAddress(index)}>
                                <div className="paras">
                                  <p>Address {index + 1} :</p>
                                  <p>
                                    {address.firstName} {address.lastName}
                                  </p>
                                  <p>{address.address}</p>
                                </div>
                                <div className="circle">
                                </div>
                              </div>
                                )
                              }
                            })}
                            <div className="addAddress" onClick={() => this.setState({
                              addAddress: true
                            })}>
                              <div className="plus">
                                <i className="fas fa-plus"></i>
                              </div>
                              <p>Add New Address</p>
                            </div>
                    </div>
                  :
                  <>
                  <div className="contact">
                  <div className="contact-label">
                    <p className="heading">Contact information</p>
                  </div>
                  <input
                    type="email"
                    className="email-input"
                    placeholder="Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
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
                      required
                      value={this.state.firstName}
                      onChange={this.handleChange}
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      name="lastName"
                      id="lastName"
                      required
                      value={this.state.lastName}
                      onChange={this.handleChange}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Address"
                    name="address"
                    id="address"
                    required
                    value={this.state.address}
                    onChange={this.handleChange}
                  />
                  <input
                    type="text"
                    placeholder="Appartment, suite, etc. (optional)"
                    name="appartment"
                    id="appartment"
                    value={this.state.appartment}
                    onChange={this.handleChange}
                  />
                  <div className="region">
                    <input
                      type="text"
                      placeholder="Country / Nation"
                      name="country"
                      required
                      id="country"
                      value={this.state.country}
                      onChange={this.handleChange}
                    />
                    <input
                      type="text"
                      placeholder="State"
                      name="state"
                      required
                      id="state"
                      value={this.state.state}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="region">
                    <input
                      type="text"
                      placeholder="City"
                      name="city"
                      required
                      id="city"
                      value={this.state.city}
                      onChange={this.handleChange}
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      name="pincode"
                      required
                      id="pincode"
                      value={this.state.pincode}
                      onChange={this.handleChange}
                    />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="Phone"
                    value={this.state.phone}
                    onChange={this.handleChange}
                  />
                </div>
                </>
                }
              </main>
              <div className="placeOrder">
                <a>
                  <i className="fas fa-chevron-left"></i>Return to cart
                </a>
                <div
                  className="checkoutbtn"
                  onClick={() => {
                    this.handlePay(total, subtotal, shipping);
                  }}
                >
                  <a>Place an Order</a>
                </div>
              </div>
            </div>
            <div className="right">
              <div className="items-container">
                  <CartCard item={{id : this.props.match.params.item}} show={false} quantity={this.props.match.params.quantity} />
              </div>
              <div className="order-details">
                <div className="sub">
                  <p className="sub-title">Subtotal</p>
                  <p>&#8377; {subtotal}</p>
                </div>
                <div className="shipping-sub">
                  <p className="sub-title">Shipping</p>
                  <p>+ &#8377; {shipping}</p>
                </div>
                {/* <div className="discount-sub">
                  <p className="sub-title">
                    Discount ({this.state.coupon.name})
                  </p>
                  <p>- &#8377; {value}</p>
                </div> */}
                <div className="points-sub">
                  <p className="sub-title">Points ({this.state.points})</p>
                  <p>- &#8377; {this.state.points}</p>
                </div>
              </div>
              <div className="total">
                <p>TOTAL</p>
                <p>&#8377; {total}</p>
              </div>
            </div>
            {this.state.openLogin ? (
              <Login
                close={(toggle) => this.setState({ openLogin: toggle })}
                login={(toggle) => {
                  this.setState({ loginStatus: toggle });
                }}
              />
            ) : null}
          </>
        )}
      </div>
    );
  }
}

import React from "react";
import { motion } from "framer-motion";
import "./cart.style.css";
import firebase from "firebase";
import remove from "./remove.svg";
import truck from "./truck.svg";
import cart from "./supermarket.svg";
import loc from "./location.svg";
import pay from "./pay.svg";
import razorpay from "./razorpay.png";
import paytm from "./paytm.png";
import phonepe from "./phonepe.png";
import Lottie from "lottie-react-web";
import loading from "../../../assets/loading.json";
import empty from "./629-empty-box.json";
import toaster from "toasted-notes";

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 0,
  },
};

const pageTransition = {
  type: "spring",
  damping: 20,
  stiffness: 100,
};

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 1,
      modal: "modal-address",
      addresses: [],
      isDefault: false,
      loading: true,
      currentUser: [],
      total: 0,
      shipping: 0,
      rental: 0,
      deposit: 0,
      address: {},
      city: "",
      state: "",
      pin: "",
      cname: "",
      cphone: "",
      add: "",
      process1: "process1",
      process2: "process2",
      editAddress: false,
      ogname: "",
      ogaddress: "",
      paymentTab: 1,
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .firestore()
          .collection("users")
          .where("email", "==", user.email)
          .onSnapshot((snap) => {
            snap.docChanges().forEach((change) => {
              this.setState({
                currentUser: change.doc.data(),
                loading: false,
              });
              var data = change.doc.data().cart;
            this.setState({
              rental: 0,
              deposit: 0,
            });
            data.map((item) => {
              this.setState({
                rental: this.state.rental + item.rent,
                deposit: this.state.deposit + item.deposit,
              });
            });
            var addresses = change.doc.data().addresses;
            var x = {};
            var newAddresses = [];

            if (addresses.length > 0) {
              addresses.map((add) => {
                if (add.default) {
                  x = add;
                } else {
                  newAddresses.push(add);
                }
              });
              newAddresses.unshift(x);
              this.setState({
                addresses: newAddresses,
                address: x,
              });
            }
            console.log(this.state.addresses.length);
            this.setState({
              total:
                this.state.shipping + this.state.deposit + this.state.rental,
            });
            });
          });
      } else {
        window.location.href = "/signin";
      }
    });
  }

  handleChange = (e) => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  };

  handleIsDefault = () => {
    this.setState({
      isDefault: !this.state.isDefault,
    });
  };

  handleDelete = (e) => {
    firebase
      .firestore()
      .collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          var cart = doc.data().cart;
          var newcart = [];
          cart.map((item) => {
            if (item.email === e.email && item.id === e.id) {
            } else {
              newcart.push(item);
            }
          });
          firebase
            .firestore()
            .collection("users")
            .doc(doc.id)
            .update({
              cart: newcart,
            })
            .then(() => {
              toaster.notify("Item removed from your cart");
            })
            .catch((err) => {
              toaster.notify(err.message);
            });
        });
      });
  };

  handleSubmit = () => {
    var arr = {};
    arr["cname"] = this.state.cname;
    arr["cphone"] = this.state.cphone;
    arr["address"] = this.state.add;
    arr["pin"] = this.state.pin;
    arr["city"] = this.state.city;
    arr["state"] = this.state.state;
    arr["default"] = this.state.isDefault;

    firebase
      .firestore()
      .collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          console.log(doc.data());
          var oldAddresses = doc.data().addresses;
          var found = false;
          oldAddresses.map((add) => {
            if (add.cname === arr.cname && add.address === arr.address) {
              found = true;
            }
          });
          if (found === false) {
            if (this.state.isDefault) {
              oldAddresses.map((add) => {
                add["default"] = false;
              });
              oldAddresses.push(arr);
              console.log(oldAddresses);
              firebase
                .firestore()
                .collection("users")
                .doc(doc.id)
                .update({
                  addresses: oldAddresses,
                })
                .then(() => {
                  this.setState({
                    modal: "modal-address",
                    city: "",
                    state: "",
                    pin: "",
                    cname: "",
                    cphone: "",
                    add: "",
                    address: arr,
                  });
                });
            } else if (oldAddresses.length === 0) {
              arr["default"] = true;
              oldAddresses.push(arr);
              console.log(oldAddresses);
              firebase
                .firestore()
                .collection("users")
                .doc(doc.id)
                .update({
                  addresses: oldAddresses,
                })
                .then(() => {
                  this.setState({
                    modal: "modal-address",
                    city: "",
                    state: "",
                    pin: "",
                    cname: "",
                    cphone: "",
                    add: "",
                    address: arr,
                  });
                });
            } else {
              oldAddresses.push(arr);
              console.log(oldAddresses);
              firebase
                .firestore()
                .collection("users")
                .doc(doc.id)
                .update({
                  addresses: oldAddresses,
                })
                .then(() => {
                  this.setState({
                    modal: "modal-address",
                    city: "",
                    state: "",
                    pin: "",
                    cname: "",
                    cphone: "",
                    add: "",
                    address: arr,
                  });
                });
            }
          } else {
            toaster.notify("Address already exists!");
          }
        });
      });
  };

  handleSelectAddress = (e) => {
    this.setState({
      address: e,
    });
  };

  handleDeleteAddress = (e) => {
    firebase
      .firestore()
      .collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          var addresses = doc.data().addresses;
          var newAddresses = [];
          addresses.map((add) => {
            if (add.cname === e.cname && add.address === e.address) {
            } else {
              newAddresses.push(add);
            }
          });
          if (newAddresses.length === 0) {
            this.setState({
              address: {},
              addresses: [],
            });
          }
          if (newAddresses.length === 1) {
            this.setState({
              address: newAddresses[0],
            });
          }
          firebase.firestore().collection("users").doc(doc.id).update({
            addresses: newAddresses,
          });
        });
      });
  };

  handleEditAddressShow = (e) => {
    this.setState({
      editAddress: true,
      modal: "modal-address-active",
      city: e.city,
      state: e.state,
      pin: e.pin,
      cname: e.cname,
      cphone: e.cphone,
      add: e.address,
      isDefault: e.default,
      ogname: e.cname,
      ogaddress: e.address,
    });
  };

  handleEditAddress = () => {
    firebase
      .firestore()
      .collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          var addresses = doc.data().addresses;
          if (this.state.isDefault === false) {
            addresses.map((add) => {
              if (
                add.cname === this.state.ogname &&
                add.address === this.state.ogaddress
              ) {
                add["cname"] = this.state.cname;
                add["cphone"] = this.state.cphone;
                add["address"] = this.state.add;
                add["pin"] = this.state.pin;
                add["city"] = this.state.city;
                add["state"] = this.state.state;
                add["default"] = this.state.isDefault;
              }
            });
            var found = false;
            addresses.map((add) => {
              if (add["default"] === true) {
                found = true;
              }
            });
            if (found === false) {
              toaster.notify("Atleast one default address is required");
            } else if (found === true) {
              firebase
                .firestore()
                .collection("users")
                .doc(doc.id)
                .update({
                  addresses: addresses,
                })
                .then(() => {
                  toaster.notify("Address Updated");
                  this.setState({
                    modal: "modal-address",
                    city: "",
                    state: "",
                    pin: "",
                    cname: "",
                    cphone: "",
                    add: "",
                    ogaddress: "",
                    ogname: "",
                  });
                });
            }
          } else {
            addresses.map((add) => {
              add["default"] = false;
            });
            addresses.map((add) => {
              if (
                add.cname === this.state.ogname &&
                add.address === this.state.ogaddress
              ) {
                add["cname"] = this.state.cname;
                add["cphone"] = this.state.cphone;
                add["address"] = this.state.add;
                add["pin"] = this.state.pin;
                add["city"] = this.state.city;
                add["state"] = this.state.state;
                add["default"] = this.state.isDefault;
              }
            });
            firebase
              .firestore()
              .collection("users")
              .doc(doc.id)
              .update({
                addresses: addresses,
              })
              .then(() => {
                toaster.notify("Address Updated");
                this.setState({
                  modal: "modal-address",
                  city: "",
                  state: "",
                  pin: "",
                  cname: "",
                  cphone: "",
                  add: "",
                  ogaddress: "",
                  ogname: "",
                });
              });
          }
        });
      });
  };

  handlePayment = () => {
    var total = Math.round(this.state.total * 0.1);
    let options = {
      key: "rzp_live_YmYlELv3yfrWe6",
      amount: total, // 2000 paise = INR 20, amount in paisa
      name: "Hire Pluto",
      description: "",
      image: "/favicon/ms-icon-310x310.png",
      handler: function (response) {
        console.log(response);
      },
      prefill: {
        name: "Harshil Mathur",
        email: firebase.auth().currentUser.email,
      },
      notes: {
        address: "Hello World",
      },
      theme: {
        color: "#393280",
      },
    };

    let rzp = new window.Razorpay(options);
    rzp.open();
  };

  render() {
    return (
      <>
        {this.state.loading ? (
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lottie
              options={{ animationData: loading }}
              width={150}
              height={150}
            />
          </div>
        ) : (
          <>
            {this.state.currentUser.cart.length === 0 ? (
              <div
                style={{
                  width: "100%",
                  height: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Lottie
                  options={{ animationData: empty }}
                  width={320}
                  height={320}
                />
                <p
                  style={{
                    fontSize: "30px",
                    color: "#313131",
                    marginBottom: "10px",
                  }}
                >
                  Your cart is empty
                </p>
                <p style={{ color: "#717171", marginBottom: "15px" }}>
                  Add items in your cart and come back later to process
                  checkout.
                </p>
                <a
                  href="/"
                  style={{
                    backgroundColor: "#fb6b25",
                    textDecoration: "none",
                    padding: "0.8rem 1rem",
                    color: "#fff",
                    borderRadius: "3px",
                  }}
                >
                  Continue to shopping
                </a>
              </div>
            ) : (
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="cart-container"
              >
                <div className="cart-section">
                  <div className="left">
                    <div className="head">
                      <div className="head-text">
                        <div className="sub">
                          <p>Your Cart</p>
                          <div className="line"></div>
                        </div>

                        {this.state.currentUser.cart.length > 0 ? (
                          <div className="item-count">
                            <p>
                              {this.state.currentUser.cart.length}{" "}
                              {this.state.currentUser.cart.length === 1
                                ? "item"
                                : " items"}
                            </p>
                          </div>
                        ) : null}
                      </div>
                      <div className="head-amt">
                      </div>
                    </div>

                    <div className="body">
                      {this.state.currentUser.cart.map((i) => (
                        <div className="prod-card">
                          <div className="card-content">
                            <div className="left-img">
                              <a
                                href={
                                  "/Category/" +
                                  i.category +
                                  "/" +
                                  i.subCategory +
                                  "/" +
                                  i.title
                                }
                              >
                                <img src={i.cover} alt="prod-img" />
                              </a>
                            </div>
                            <div className="right-details">
                              <div className="item-name">
                                <a
                                  href={
                                    "/Category/" +
                                    i.category +
                                    "/" +
                                    i.subCategory +
                                    "/" +
                                    i.title
                                  }
                                >
                                  <p>{i.title}</p>
                                </a>
                                <div
                                  className="delete"
                                  onClick={() => this.handleDelete(i)}
                                >
                                  <img src={remove} alt="remove" />
                                  <p>Delete</p>
                                </div>
                              </div>
                              <div className="item-price-time">
                                <div className="tenure">
                                  <p>Tenure</p>
                                  <span>{i.month} months</span>
                                </div>
                                <div className="tenure">
                                  <p>Rent</p>
                                  <span>&#8377; {i.rent} / month</span>
                                </div>
                                <div className="tenure">
                                  <p>Quantity</p>
                                  <span>1</span>
                                </div>
                                <div className="tenure">
                                  <p>Deposit</p>
                                  <span>&#8377; {i.deposit}</span>
                                </div>
                              </div>
                              <div className="item-delivery">
                                <img src={truck} alt="truck" />
                                <p>Free delivery</p>
                                <i class="fas fa-info"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="right">
                    <div className="coupon-box">
                      <div className="coupon">
                        <input type="text" placeholder="Enter coupon code" />
                        <button type="button">APPLY</button>
                      </div>
                    </div>
                    <div className="process-box">
                      <div className="process-header">
                        <div className="step">
                          {this.state.tab === 1 ? (
                            <p
                              className="active"
                              onClick={() =>
                                this.setState({
                                  tab: 1,
                                  process1: "process1",
                                  process2: "process2",
                                })
                              }
                            >
                              CART
                            </p>
                          ) : (
                            <>
                              {this.state.tab > 1 ? (
                                <p
                                  className="done"
                                  onClick={() =>
                                    this.setState({
                                      tab: 1,
                                      process1: "process1",
                                      process2: "process2",
                                    })
                                  }
                                >
                                  CART
                                </p>
                              ) : (
                                <p onClick={() => this.setState({ tab: 1 })}>
                                  CART
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        <div className={this.state.process1}></div>
                        <div className="step">
                          {this.state.tab === 2 ? (
                            <p
                              className="active"
                              onClick={() =>
                                this.setState({ tab: 2, process2: "process2" })
                              }
                            >
                              ADDRESS
                            </p>
                          ) : (
                            <>
                              {this.state.tab > 2 ? (
                                <p
                                  className="done"
                                  onClick={() =>
                                    this.setState({
                                      tab: 2,
                                      process2: "process2",
                                    })
                                  }
                                >
                                  ADDRESS
                                </p>
                              ) : (
                                <p>ADDRESS</p>
                              )}
                            </>
                          )}
                        </div>
                        <div className={this.state.process2}></div>
                        <div className="step">
                          {this.state.tab === 3 ? (
                            <p
                              className="active"
                              onClick={() => this.setState({ tab: 3 })}
                            >
                              PAYMENT
                            </p>
                          ) : (
                            <>
                              {this.state.tab > 3 ? (
                                <p
                                  className="done"
                                  onClick={() => this.setState({ tab: 3 })}
                                >
                                  PAYMENT
                                </p>
                              ) : (
                                <p>PAYMENT</p>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="process-body">
                        {this.state.tab === 1 ? (
                          <div className="section">
                            <div className="title">
                              <img src={cart} alt="cart-summary" />
                              <p>Cart Summary</p>
                            </div>
                            <div className="body">
                              <p>PRICE DETAILS</p>
                              <div className="line"></div>
                              <div className="rent">
                                <p>Total Monthly Rent</p>
                                <span>&#8377; {this.state.rental} / month</span>
                              </div>

                              <div className="rent">
                                <p>Shipping Fees</p>
                                <span>
                                  {this.state.shipping > 0
                                    ? this.state.shipping
                                    : "Free"}
                                </span>
                              </div>

                              <div className="rent">
                                <p>Security Deposit</p>
                                <span>&#8377; {this.state.deposit}</span>
                              </div>

                              <div className="total">
                                <p>Total Payment</p>
                                <span>&#8377; {this.state.total}</span>
                              </div>

                              <div className="next-button">
                                <button
                                  type="button"
                                  onClick={() =>
                                    this.setState({
                                      tab: 2,
                                      process1: "process1-active",
                                    })
                                  }
                                >
                                  Proceed
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : this.state.tab === 2 ? (
                          <div className="address-section">
                            <div className="title">
                              <img src={loc} alt="address-icon" />
                              <p>Address Details</p>
                            </div>
                            <div className="body">
                              <div className="address-card-list">
                                {this.state.addresses.map((add) => {
                                  return (
                                    <div className="address-card">
                                      <div className="check-address">
                                        {this.state.address.cname ===
                                          add.cname &&
                                        this.state.address.address ===
                                          add.address ? (
                                          <i class="far fa-dot-circle"></i>
                                        ) : (
                                          <i
                                            class="far fa-circle"
                                            onClick={() =>
                                              this.handleSelectAddress(add)
                                            }
                                          ></i>
                                        )}
                                      </div>
                                      <div className="address-details">
                                        <h1>{add.cname}</h1>
                                        <p>{add.address}</p>
                                        <p>
                                          {add.city} -{add.pin}, {add.state}
                                        </p>
                                        <p>
                                          Mobile : <span>{add.cphone}</span>
                                        </p>
                                      </div>
                                      <div className="address-actions">
                                        <i
                                          class="far fa-edit"
                                          onClick={() =>
                                            this.handleEditAddressShow(add)
                                          }
                                        ></i>
                                        <i
                                          class="far fa-trash-alt"
                                          onClick={() =>
                                            this.handleDeleteAddress(add)
                                          }
                                        ></i>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="add-address">
                                <div
                                  className="add-box"
                                  onClick={() =>
                                    this.setState({
                                      modal: "modal-address-active",
                                    })
                                  }
                                >
                                  <p>+ Add New Address</p>
                                </div>
                              </div>
                              <div className="next-back-button">
                                <button
                                  type="button"
                                  onClick={() =>
                                    this.setState({
                                      tab: 3,
                                      process2: "process2-active",
                                    })
                                  }
                                >
                                  PROCEED TO PAYMENT
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="payment-section">
                            <div className="title">
                              <img src={pay} alt="payemnt-logo" />
                              <p>Choose Payment</p>
                            </div>
                            <div className="body">
                              <div
                                className="pay"
                                onClick={() => this.setState({ paymentTab: 1 })}
                              >
                                {this.state.paymentTab === 1 ? (
                                  <i class="far fa-dot-circle active"></i>
                                ) : (
                                  <i class="far fa-circle"></i>
                                )}
                                <img src={razorpay} alt="razorpay-logo" />
                                <p>Pay via razorpay</p>
                              </div>
                              {/* <div
                                className="pay"
                                onClick={() => this.setState({ paymentTab: 2 })}
                              >
                                {this.state.paymentTab === 2 ? (
                                  <i class="far fa-dot-circle active"></i>
                                ) : (
                                  <i class="far fa-circle"></i>
                                )}
                                <img src={paytm} alt="razorpay-logo" />
                                <p>Pay via paytm</p>
                              </div>
                              <div
                                className="pay"
                                onClick={() => this.setState({ paymentTab: 3 })}
                              >
                                {this.state.paymentTab === 3 ? (
                                  <i class="far fa-dot-circle active"></i>
                                ) : (
                                  <i class="far fa-circle"></i>
                                )}
                                <img src={phonepe} alt="razorpay-logo" />
                                <p>Pay via phonepe</p>
                              </div> */}

                              <div
                                className="final-button"
                                onClick={this.handlePayment}
                              >
                                <button type="button">PROCEED</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add address modal */}
                  <div className={this.state.modal}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <p>ADD NEW ADDRESS</p>
                        <div
                          className="modal-address-close-button"
                          onClick={() =>
                            this.setState({ modal: "modal-address" })
                          }
                        >
                          <i class="far fa-times-circle"></i>
                        </div>
                      </div>
                      <div className="modal-body">
                        <div className="modal-contact-details">
                          <p>CONTACT DETAILS</p>
                          <input
                            type="text"
                            placeholder="Name"
                            name="cname"
                            onChange={this.handleChange}
                            value={this.state.cname}
                          />
                          <input
                            type="text"
                            placeholder="Mobile Number"
                            name="cphone"
                            onChange={this.handleChange}
                            value={this.state.cphone}
                          />
                        </div>
                        <div className="modal-address-details">
                          <p>ADDRESS DETAILS</p>
                          <input
                            type="text"
                            placeholder="Address (House No., building, street, area)"
                            name="add"
                            onChange={this.handleChange}
                            value={this.state.add}
                          />
                          <input
                            type="text"
                            placeholder="Pincode"
                            name="pin"
                            onChange={this.handleChange}
                            value={this.state.pin}
                          />
                          <input
                            type="text"
                            placeholder="City"
                            name="city"
                            onChange={this.handleChange}
                            value={this.state.city}
                          />
                          <input
                            type="text"
                            placeholder="State"
                            name="state"
                            onChange={this.handleChange}
                            value={this.state.state}
                          />
                          <div id="check-default">
                            <input
                              type="checkbox"
                              onChange={this.handleIsDefault}
                              checked={this.state.isDefault}
                            />
                            <p>Make this my default address</p>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        {this.state.editAddress ? (
                          <button
                            type="button"
                            onClick={this.handleEditAddress}
                          >
                            UPDATE ADDRESS
                          </button>
                        ) : (
                          <button type="button" onClick={this.handleSubmit}>
                            ADD ADDRESS
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </>
    );
  }
}

export default Cart;

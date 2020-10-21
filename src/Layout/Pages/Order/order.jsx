import React from "react";
import "./order.css";
import firebase from "firebase";
import OrderCard from "../../Components/OrderCard/OrderCard";
import loading from "../../../assets/loading.json";
import circleLoading from "../../../assets/circular loading.json";
import Lottie from "lottie-react-web";
import toaster from "toasted-notes";
import Loader from "../../Components/Loader/Loader";

export default class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: "",
      order: "",
      loading: true,
      status: ["ordered", "packed", "out", "delivered"],
      starCount: 0,
      review: "",
      reviewProductCount: 0,
      loggedIn: false,
      modal: true,
      btnLoading: false,
      rateProducts: [],
      userName: ""
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn: true,
          userEmail: user.email,
        });
      }
    });
    // firebase.firestore().collection("users").doc(this.props.match.params.id).get().then(doc => {
    //   this.setState({
    //     userName: doc.data().name
    //   })
    // })
    firebase
      .firestore()
      .collection("orders")
      .doc(this.props.match.params.id)
      .get()
      .then((doc) => {
        console.log(doc.data())
        firebase.firestore().collection("users").doc(doc.data().user).get().then(snap => {
          this.setState(
            {
              order: doc.data(),
              loading: false,
              userName: snap.data().name
            },
            () => {
              var products = [];
              this.state.order.products.map((product) => {
                if (product.rate === false) {
                  products.push(product);
                }
              });
              this.setState(
                {
                  rateProducts: products,
                },
                () => {
                  if (this.state.rateProducts.length < 1) {
                    this.setState({
                      modal: false,
                    });
                  }
                }
              );
            }
          );
        })
      });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleRate = () => {
    this.setState({
      btnLoading: true,
    });
    if (this.state.starCount > 0) {
      console.log(this.state.rateProducts);
      firebase
        .firestore()
        .collection("products")
        .doc(this.state.rateProducts[this.state.reviewProductCount].id)
        .get()
        .then((snap) => {
          var ratings = snap.data().ratings;
          var rate = {};
          rate.stars = this.state.starCount;
          rate.review = this.state.review;
          rate.email = this.state.userEmail;
          rate.date = new Date();
          rate.name = this.state.userName;
          ratings.push(rate);
          firebase
            .firestore()
            .collection("products")
            .doc(snap.id)
            .update({
              ratings: ratings,
            })
            .then(() => {
              firebase
                .firestore()
                .collection("orders")
                .doc(this.props.match.params.id)
                .get()
                .then((doc) => {
                  var products = doc.data().products;
                  products.forEach(product => {
                    if(product.id === this.state.rateProducts[this.state.reviewProductCount].id){
                      product.rate = true;
                    }
                  })
                  firebase
                    .firestore()
                    .collection("orders")
                    .doc(this.props.match.params.id)
                    .update({
                      products: products,
                    }).then(() => {
                      if (
                        this.state.reviewProductCount <
                        this.state.rateProducts.length - 1
                      ) {
                        this.setState({
                          btnLoading: false,
                          starCount: 0,
                          review: "",
                          reviewProductCount: this.state.reviewProductCount + 1,
                        });
                      } else {
                        this.setState({
                          modal: false,
                          btnLoading: false,
                        });
                      }
                    });
                });
            });
        });
    } else {
      toaster.notify("Please add stars to rate the product");
      this.setState({
        btnLoading: false,
      });
    }
  };

  render() {
    return (
      <div className="container">
        {this.state.loading ? (
          <Loader />
        ) : (
          <div className="container-main">
            <div className="content">
              <div className="wrap">
                <div className="main">
                  <main>
                    {/* <div className="Title">
                      <h2 className="title">
                        Log in to view all order details
                      </h2>
                      <p className="text">
                        You can find your order number in the receipt you
                        received via email.
                      </p>
                    </div>
                    <div className="login_form">
                      <input
                        className="a"
                        type="email"
                        placeholder="Email"
                      ></input>
                      <input
                        className="b"
                        type="text"
                        placeholder="Order number"
                      ></input>
                      <button className="button" type="submit" class="btn">
                        Log in
                      </button>
                    </div> */}

                    <div className="head">
                      <p>Thanks for placing your order...</p>
                    </div>

                    <div className="section_content">
                      <div className="status">
                        <div className="icon">
                          <div
                            className={
                              this.state.status.includes("ordered")
                                ? "done"
                                : "ordered"
                            }
                          >
                            <i className="fas fa-check"></i>
                            <span className="title">Ordered</span>
                          </div>

                          <div
                            className={
                              this.state.status.includes("packed")
                                ? "done"
                                : "packed"
                            }
                          >
                            <i className="fas fa-box"></i>
                            <span className="title">Packed</span>
                          </div>

                          <div
                            className={
                              this.state.status.includes("out")
                                ? "done"
                                : "out-for-delivery"
                            }
                          >
                            <i className="fas fa-truck"></i>
                            <span className="title">Out for delivery</span>
                          </div>

                          <div
                            className={
                              this.state.status.includes("delivered")
                                ? "done"
                                : "delivered"
                            }
                          >
                            <i className="fas fa-home"></i>
                            <span className="title">Delivered</span>
                          </div>
                        </div>
                        <div className="icon_text">
                          <h2>Your shipment is on the way</h2>
                          <p>
                            Come back to this page for updates on your shipment
                            status.
                          </p>
                        </div>
                      </div>
                      <div className="order_update">
                        <h2>Order updates</h2>
                      </div>
                      <div className="message">
                        <p>
                          Thank You For Placing Your Order. You will Receive an
                          SMS on your registered mobile number with a link
                          asking you to confirm your COD Order. Kindly confirm
                          the order via the same
                        </p>
                      </div>
                      <div className="customer_information">
                        <h2>Customer information</h2>
                        <div className="content_information">
                          <div className="text_area_a">
                            <h3>Shipping address</h3>
                            <p>Welcome to the website. </p>
                            <h3>Shipping method</h3>
                            <p>Welcome to the website. </p>
                          </div>
                          <div className="text_area_b">
                            <h3>Billing address</h3>
                            <p>Welcome to the website.</p>
                            <h3>Payment method</h3>
                            <p>Welcome to the website. </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="step_footer">
                      <p className="need">
                        Need help? <span>Contact us</span>
                      </p>
                      <button type="button" className="continue" onClick={() => window.location.href = "/"}>Continue shopping</button>
                    </div>
                  </main>
                </div>
              </div>
            </div>

            <div className="sidebar">
              <div className="items-container">
                {this.state.order &&
                  this.state.order.products.map((item, index) => (
                    <OrderCard
                      item={item}
                      key={index}
                    />
                  ))}
              </div>
              <div className="order-details">
                <div className="shipping-sub">
                  <p className="sub-title">Shipping</p>
                  <p>+ &#8377; {this.state.order.shipping}</p>
                </div>
                {
                  this.state.order.points ? 
                  <div className="points-sub">
                    <p className="sub-title">
                      Points ({this.state.order.points})
                    </p>
                    <p>- &#8377; {this.state.order.points}</p>
                  </div>
                : null
                }
              </div>
              <div className="total">
                <p>TOTAL</p>
                <p>&#8377; {this.state.order.total}</p>
              </div>
            </div>
            {this.state.status.includes("delivered") ? (
              this.state.modal ? (
                <div className="rating-cont">
                  <div className="rating-modal">
                    <div className="modal-head">
                      <p>How was the product ?</p>
                      <i
                        className="fas fa-times"
                        onClick={() => this.setState({ modal: false })}
                      ></i>
                    </div>
                    <div className="modal-body">
                      {this.state.rateProducts.map((product, index) => {
                        if (
                          index === this.state.reviewProductCount &&
                          !product.rate
                        ) {
                          return (
                            <>
                              <OrderCard
                                item={
                                  this.state.rateProducts[
                                    this.state.reviewProductCount
                                  ]
                                }
                                key={index}
                              />
                              <div className="rating">
                                <div className="stars">
                                  <p>Rate : </p>
                                  <i
                                    className={
                                      this.state.starCount > 0
                                        ? "fas fa-star"
                                        : "far fa-star"
                                    }
                                    onClick={() =>
                                      this.setState({ starCount: 1 })
                                    }
                                  ></i>
                                  <i
                                    className={
                                      this.state.starCount > 1
                                        ? "fas fa-star"
                                        : "far fa-star"
                                    }
                                    onClick={() =>
                                      this.setState({ starCount: 2 })
                                    }
                                  ></i>
                                  <i
                                    className={
                                      this.state.starCount > 2
                                        ? "fas fa-star"
                                        : "far fa-star"
                                    }
                                    onClick={() =>
                                      this.setState({ starCount: 3 })
                                    }
                                  ></i>
                                  <i
                                    className={
                                      this.state.starCount > 3
                                        ? "fas fa-star"
                                        : "far fa-star"
                                    }
                                    onClick={() =>
                                      this.setState({ starCount: 4 })
                                    }
                                  ></i>
                                  <i
                                    className={
                                      this.state.starCount > 4
                                        ? "fas fa-star"
                                        : "far fa-star"
                                    }
                                    onClick={() =>
                                      this.setState({ starCount: 5 })
                                    }
                                  ></i>
                                </div>
                                {this.state.loggedIn ? (
                                  <div className="review">
                                    <label>Review</label>
                                    <textarea
                                      name="review"
                                      cols="60"
                                      rows="2"
                                      placeholder="Write something..."
                                      onChange={this.handleChange}
                                    ></textarea>
                                  </div>
                                ) : null}
                              </div>
                            </>
                          );
                        }
                      })}
                    </div>
                    <div className="modal-footer">
                      {this.state.btnLoading ? (
                        <button type="button">
                          <Lottie
                            options={{ animationData: circleLoading }}
                            width={25}
                            height={25}
                          />
                        </button>
                      ) : (
                        <button type="button" onClick={() => this.handleRate()}>
                          Rate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : null
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

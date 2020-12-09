import React from "react";
import "./order.css";
import firebase from "firebase";
import OrderCard from "../../Components/OrderCard/OrderCard";
import loading from "../../../assets/loading.json";
import circleLoading from "../../../assets/circular loading.json";
import Lottie from "lottie-react-web";
import toaster from "toasted-notes";
import Loader from "../../Components/Loader/Loader";
import axios from "axios";
import moment from "moment";

export default class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: "",
      order: "",
      loading: true,
      status: [],
      replacement: false,
      replacementReason: "",
      starCount: 0,
      review: "",
      reviewProductCount: 0,
      loggedIn: false,
      modal: true,
      btnLoading: false,
      rateProducts: [],
      userName: "",
      trackStatus: 0,
      shipmentStaus: 0,
      shipmentActivities: [],
      trackUrl: "",
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
        console.log(doc.data());
        this.setState(
          {
            order: doc.data(),
            status: doc.data().status,
          },
          async () => {
            console.log(this.state.order.tracking);
            var data = {
              awb: this.state.order.tracking,
            };
            if (this.state.order.tracking) {
              var res = await axios.post(
                "http://localhost:5000/api/trackOrder",
                data
              );
              var status = this.state.status;
              if (!status.includes(res.data.track_status)) {
                status.push(res.data.shipment_status);
              }
              this.setState(
                {
                  trackStatus: res.data.track_status,
                  status: status,
                  shipmentActivities: res.data.shipment_track_activities,
                  trackUrl: res.data.track_url,
                },
                () => {
                  firebase
                    .firestore()
                    .collection("orders")
                    .doc(this.props.match.params.id)
                    .update({
                      status: this.state.status,
                    });
                }
              );
            }

            var products = [];
            this.state.order.products.map((product) => {
              if (product.rate === false) {
                products.push(product);
              }
            });
            this.setState(
              {
                rateProducts: products,
                loading: false,
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
          rate.email = this.state.order.email;
          rate.date = new Date();
          rate.name = this.state.order.name;
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
                  products.forEach((product) => {
                    if (
                      product.id ===
                      this.state.rateProducts[this.state.reviewProductCount].id
                    ) {
                      product.rate = true;
                    }
                  });
                  firebase
                    .firestore()
                    .collection("orders")
                    .doc(this.props.match.params.id)
                    .update({
                      products: products,
                    })
                    .then(() => {
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
                    <div className="head">
                      <p>Thanks for placing your order...</p>
                    </div>

                    <div className="section_content">
                      <div className="status">
                        <div className="icon">
                          <div
                            className={
                              this.state.status.includes(0) ||
                              this.state.status.includes(6) ||
                              this.state.status.includes(17) ||
                              this.state.status.includes(7)
                                ? "done"
                                : "ordered"
                            }
                          >
                            <i className="fas fa-check"></i>
                            <span className="title">Ordered</span>
                          </div>

                          <div
                            className={
                              this.state.status.includes(6) ||
                              this.state.status.includes(17) ||
                              this.state.status.includes(7)
                                ? "done"
                                : "packed"
                            }
                          >
                            <i className="fas fa-box"></i>
                            <span className="title">Packed</span>
                          </div>

                          <div
                            className={
                              this.state.status.includes(17) ||
                              this.state.status.includes(7)
                                ? "done"
                                : "out-for-delivery"
                            }
                          >
                            <i className="fas fa-truck"></i>
                            <span className="title">Out for delivery</span>
                          </div>

                          <div
                            className={
                              this.state.status.includes(7)
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
                        <div className="order-status">
                          {this.state.shipmentActivities.length > 0 ? (
                            this.state.shipmentActivities &&
                            this.state.shipmentActivities.map((activity) => {
                              return (
                                <div className="activity">
                                  <h5>Activity: {activity.activity}</h5>
                                  <p>Location: {activity.location}</p>
                                  <p>
                                    Date:{" "}
                                    {moment(activity.date).format(
                                      "MMMM Do YYYY, h:mm a"
                                    )}
                                  </p>
                                </div>
                              );
                            })
                          ) : (
                            <p className="noUpdates">
                              Currently there are no updates available ...
                            </p>
                          )}
                        </div>
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
                            <p>{this.state.order.address}</p>
                          </div>
                          <div className="text_area_b">
                            <h3>Payment method</h3>
                            <p>{this.state.order.paymentMethod}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="step_footer">
                      <div className="replacement">
                        <div className="need">
                          <p>
                            Need help? <span>Contact us</span>
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="continue"
                        onClick={() => this.setState({ replacement: true })}
                      >
                        Replacement
                      </button>
                    </div>
                  </main>
                </div>
              </div>
            </div>

            <div className="sidebar">
              <div className="items-container">
                {this.state.order &&
                  this.state.order.products.map((item, index) => (
                    <OrderCard item={item} key={index} />
                  ))}
              </div>
              <div className="order-details">
                <div className="shipping-sub">
                  <p className="sub-title">Shipping</p>
                  <p>+ &#8377; {this.state.order.shipping}</p>
                </div>
                {this.state.order.points ? (
                  <div className="points-sub">
                    <p className="sub-title">
                      Points ({this.state.order.points})
                    </p>
                    <p>- &#8377; {this.state.order.points}</p>
                  </div>
                ) : null}
              </div>
              <div className="total">
                <p>TOTAL</p>
                <p>&#8377; {this.state.order.total}</p>
              </div>
            </div>
            {this.state.status.includes(7) ? (
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

            {this.state.replacement ? (
              <div className="rating-cont">
                <div className="rating-modal">
                  <div className="modal-head">
                    <p>Why are you returning this : </p>

                    <i
                      className="fas fa-times"
                      onClick={() => this.setState({ replacement: false })}
                    ></i>
                  </div>
                  <div className="modal-body">
                    <div className="dropdown">
                      <select
                        onChange={(e) =>
                          this.setState({ replacementReason: e.target.value })
                        }
                      >
                        <option selected value="Bought by mistake">
                          Bought by mistake
                        </option>
                        <option value="Better price available">
                          Better price available
                        </option>
                        <option value="Performance or quality not adequate">
                          Performance or quality not adequate
                        </option>
                        <option value="Incompatible or not useful">
                          Incompatible or not useful
                        </option>
                        <option value="Product damaged, but shipping box OK">
                          Product damaged, but shipping box OK
                        </option>
                        <option value="Item arrived too late">
                          Item arrived too late
                        </option>
                        <option value="Missing parts or accessories">
                          Missing parts or accessories
                        </option>
                        <option value="Both product and shipping box damaged">
                          Both product and shipping box damaged
                        </option>
                        <option value="Wrong items was sent">
                          Wrong items was sent
                        </option>
                        <option value="Item defective or dosen't work">
                          Item defective or dosen't work
                        </option>
                        <option value="Received item i didn't buy">
                          Received item i didn't buy (no refund needed)
                        </option>
                        <option value="No longer neended">
                          No longer neended
                        </option>
                        <option value="Did not approve purchase">
                          Did not approve purchase
                        </option>
                        <option value="Inaccurate website description">
                          Inaccurate website description
                        </option>
                      </select>
                      {/* <button>Bought by mistake</button>
                      <div class="dropdown-content"></div> */}
                    </div>
                    <button className="replace">Replace</button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

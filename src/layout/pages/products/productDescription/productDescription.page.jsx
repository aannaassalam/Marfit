import React from "react";
import { motion } from "framer-motion";
import "./productDescription.style.css";

import one from "./1.jpeg";
import offer from "./sale.svg";
import cart from "./shopping-cart.svg";
import ProdDesc from "../../../Components/prodDesc/prodDesc.component";
import Lottie from "lottie-react-web";
import loading from "../../../../assets/loading.json";

import Slider, { Range } from "rc-slider";
import ReactTooltip from "react-tooltip";
import "rc-slider/assets/index.css";
import firebase from "firebase";
import Swiper from "swiper";
import { ToastContainer, toast } from "react-toastify";
import empty from "../629-empty-box.json";

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

class ProductDesc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      viewProd: true,
      value: 1,
      type: [],
      product: [],
      addLoading: false,
      simProducts: [],
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("supplier")
      .get()
      .then((snap) => {
        var products = [];
        snap.forEach((doc) => {
          doc.data().products.map((product) => {
            products.push(product);
          });
          var productShow = {};
          var simProducts = [];
          products.map((product) => {
            if (
              product.category.toLowerCase() ===
              this.props.match.params.id1.toLowerCase()
            ) {
              if (
                product.subCategory.toLowerCase() ===
                this.props.match.params.id2.toLowerCase()
              ) {
                if (
                  product.title.toLowerCase() ===
                  this.props.match.params.id3.toLowerCase()
                ) {
                  productShow = product;
                } else {
                  simProducts.push(product);
                }
              }
            }
          });
          productShow["month"] = this.state.value;
          this.setState({
            product: productShow,
            seller: doc.data(),
            simProducts: simProducts,
            loading: false,
          });
        });
      });

    var swiper = new Swiper(".swiper-container2", {
      slidesPerView: 3,
      spaceBetween: 30,
    });
  }

  handleSlider = (value) => {
    var product = this.state.product;
    product["month"] = value;
    this.setState({
      value: value,
      product: product,
    });
  };

  handleRent = () => {
    this.setState({
      addLoading: true,
    });
    firebase
      .firestore()
      .collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          var cart = doc.data().cart;
          var found = false,
            monthchanged = false;
          cart.map((item) => {
            if (
              item.email === this.state.product.email &&
              item.id === this.state.product.id
            ) {
              found = true;
              if (item.month !== this.state.product.month) {
                monthchanged = true;
                item["month"] = this.state.value;
              }
            }
          });
          if (found === false) {
            cart.push(this.state.product);
            firebase
              .firestore()
              .collection("users")
              .doc(doc.id)
              .update({
                cart: cart,
              })
              .then(() => {
                toast.success("Added to cart");
                this.setState({
                  addLoading: false,
                });
                this.removeFromWishlist(this.state.product);
              });
          } else if (found === true && monthchanged === true) {
            firebase
              .firestore()
              .collection("users")
              .doc(doc.id)
              .update({
                cart: cart,
              })
              .then(() => {
                toast.success("Updated your cart");
                this.setState({
                  addLoading: false,
                });
              });
          } else {
            toast.error("Item already exist in your cart");
            this.setState({
              addLoading: false,
            });
          }
        });
      });
  };

  addToWishlist = (e) => {
    firebase
      .firestore()
      .collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          var wishlist = doc.data().wishlist;
          var found = false;
          wishlist.map((item) => {
            if (item.email === e.email && item.id === e.id) {
              found = true;
            }
          });
          if (found === false) {
            e["isWished"] = true;
            wishlist.push(e);
            firebase
              .firestore()
              .collection("users")
              .doc(doc.id)
              .update({
                wishlist: wishlist,
              })
              .then(() => {
                toast.success("Added to your wishlist");
              });
          } else {
            toast.error("Item already exists in your wishlist");
          }
        });
      });
  };

  removeFromWishlist = (e) => {
    firebase
      .firestore()
      .collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          var wishlist = doc.data().wishlist;
          var newwishlist = [];
          wishlist.map((item) => {
            if (item.email === e.email && item.id === e.id) {
            } else {
              newwishlist.push(item);
            }
          });
          firebase
            .firestore()
            .collection("users")
            .doc(doc.id)
            .update({
              wishlist: newwishlist,
            })
            .then(() => {
              toast.success(" Item removed from your wishlist");
            });
        });
      });
  };

  render() {
    const marks = {
      1: (
        <div className="sliderLabel">
          <div className="indicator"></div>
          {this.state.value !== 1 ? <p>1+</p> : <p className="active">1</p>}
        </div>
      ),
      10: (
        <div className="sliderLabel">
          <div className="indicator"></div>
          {this.state.value !== 10 ? (
            <p>10</p>
          ) : (
              <p className="active">10</p>
            )}
        </div>
      ),
    };

    var simCount = 0;
    return (
      <>
        <ToastContainer />
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
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="product-desc-container"
            >
              <div className="categorylist-breadcrumb">
                <div className="breadcrumb-menu">
                  <div className="bd-menu-list">
                    <a href="/" style={{ cursor: "pointer" }}>
                      Home
                  </a>
                    <a>
                      <i className="fas fa-chevron-right"></i>
                    </a>
                    <a
                      href={"/Category/" + this.props.match.params.id1}
                      style={{ cursor: "pointer" }}
                    >
                      {this.props.match.params.id1}
                    </a>
                    <a>
                      <i class="fas fa-chevron-right"></i>
                    </a>
                    <a
                      href={
                        "/Category/" +
                        this.props.match.params.id1 +
                        "/" +
                        this.props.match.params.id2
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {this.props.match.params.id2}
                    </a>
                    <a>
                      <i class="fas fa-chevron-right"></i>
                    </a>
                    <a
                      href={
                        "/Category/" +
                        this.props.match.params.id1 +
                        "/" +
                        this.props.match.params.id2 +
                        "/" +
                        this.props.match.params.id3
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {this.props.match.params.id3}
                    </a>
                  </div>
                </div>
              </div>
              {this.state.product.title ? (
                <div className="desc-container">
                  <div className="prod-desc">
                    <div className="prod-photo">
                      <img src={this.state.product.cover} alt="prod-img" />
                    </div>
                    <div className="prod-details">
                      <div className="content">
                        <ProdDesc product={this.state.product} />
                      </div>
                    </div>

                    {/* Prod similar */}
                    <div className="prod-similar">
                      <div className="header">
                        <p>You may also like</p>
                        <div className="line"></div>
                      </div>
                      <div className="body">
                        <div class="swiper-container2">
                          <div class="swiper-wrapper">
                            {this.state.simProducts.map((item) => {
                              if (simCount < 3) {
                                simCount++;
                                return (
                                  <div class="swiper-slide">
                                    <img src={item.cover} alt="one" />
                                    <div className="details">
                                      <p>{item.title}</p>
                                      <div className="price-review">
                                        <p>&#8377; {item.rent}</p>
                                        <a
                                          href={
                                            "/Category/" +
                                            item.category +
                                            "/" +
                                            item.subCategory +
                                            "/" +
                                            item.title
                                          }
                                        >
                                          View Details
                                      </a>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <MostRated /> */}
                  </div>

                  {/* Price section */}
                  <div className="prod-buy">
                    {/* product title */}
                    <div className="prod-head">
                      <p>{this.state.product.title}</p>
                      {this.state.product.isWished ? (
                        <div
                          onClick={() =>
                            this.removeFromWishlist(this.state.product)
                          }
                        >
                          <i class="fas fa-heart red"></i>
                        </div>
                      ) : (
                          <div
                            onClick={() => this.addToWishlist(this.state.product)}
                          >
                            <i class="far fa-heart"></i>
                          </div>
                        )}
                    </div>

                    {/* price show */}
                    <div className="prod-pricing">
                      <div className="pricing-text">
                        <p>Pricing Details</p>
                      </div>
                      <div className="pricing-body">
                        <div className="price-amt">
                          <div className="month-price">
                            <p>
                              &#8377; {this.state.product.rent}
                            </p>
                            <span>
                              Retail Price{" "}
                              <i
                                class="fas fa-info"
                                data-tip
                                data-for="month-info"
                              ></i>
                            </span>
                            <ReactTooltip id="month-info" effect="solid">
                              <p className="tool-tip-info">
                                Sale Price
                            </p>
                            </ReactTooltip>
                          </div>
                          <div className="deposit-price">
                            <p>&#8377; {this.state.product.deposit}</p>
                            <span>
                              Actual Price{" "}
                              <i
                                class="fas fa-info"
                                data-tip
                                data-for="deposit-info"
                              ></i>
                            </span>
                            <ReactTooltip id="deposit-info" effect="solid">
                              <p className="tool-tip-info">
                                Actual Price
                            </p>
                            </ReactTooltip>
                          </div>
                        </div>
                        <div className="price-extra">
                          <div className="extra">
                            <i class="fas fa-check-circle"></i>
                            <p>Free trials</p>
                          </div>
                          <div className="extra">
                            <i class="fas fa-check-circle"></i>
                            <p>Free Relocation</p>
                          </div>
                          <div className="extra">
                            <i class="fas fa-check-circle"></i>
                            <p>Free Upgrades</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Select tenure */}
                    <div className="prod-tenure">
                      <div className="tenure-text">
                        <p>Select the number of Quantities</p>
                      </div>

                      <div className="tenure-body">
                        <p>
                          Quantity selected :{" "}
                          <span>
                            {this.state.value === 1
                              ? this.state.value + " item"
                              : this.state.value + " items"}
                          </span>
                        </p>
                        <div className="slid">
                          <Slider
                            marks={marks}
                            value={this.state.value}
                            step={1}
                            min={1}
                            max={10}
                            onChange={(e) => this.handleSlider(e)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Select and view offers */}
                    <div className="prod-offers">
                      <div className="offer-text">
                        <p>Special Offers</p>
                      </div>
                      <div className="offer-body">
                        <div className="coupon">
                          <div className="icon">
                            <img src={offer} alt="offers" />
                          </div>
                          <div className="content">
                            <p>
                              Use Code <span>BAG20</span>
                            </p>
                            <p className="discount-desc">Get flat 20% off</p>
                            <p style={{ color: "orange" }}>Read more</p>
                          </div>
                          <div className="copy">
                            <button type="button">COPY</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* book now button */}
                    <div className="prod-book">
                      {this.state.addLoading ? (
                        <div>
                          <Lottie
                            options={{ animationData: loading }}
                            width={100}
                            height={100}
                          />
                        </div>
                      ) : (
                          <button type="button" onClick={this.handleRent}>
                            <img src={cart} alt="cart-logo" />
                        ADD TO CART
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "85vh",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Lottie
                      options={{ animationData: empty }}
                      width={200}
                      height={200}
                    />
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#313131",
                      }}
                    >
                      Sorry! we could not find any items
                </p>
                  </div>
                )}
            </motion.div>
          )}
      </>
    );
  }
}

export default ProductDesc;

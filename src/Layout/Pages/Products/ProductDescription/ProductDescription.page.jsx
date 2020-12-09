import React from "react";
import "./ProductDescription.style.css";
import Slider from "../../../Components/Slider/Slider";
import { motion } from "framer-motion";
import Lottie from "lottie-react-web";
import empty from "./629-empty-box.json";
import loading from "../../../../assets/loading.json";
import Loader from "../../../Components/Loader/Loader";
import toaster from "toasted-notes";
import moment from "moment";
import ReactImageMagnify from "react-image-magnify";
import firebase from "firebase";
import { Link } from "react-router-dom";

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

export default class ProductDesc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderTitle: "You may also like",
      activeImage: 0,
      isWished: false,
      cart: [],
      product: {},
      simProducts: [],
      sizeSelected: "XS",
      usersQuantity: 1,
      currentUser: "",
      loading: true,
      colorSelected: "",
      colors: [],
      ratings: [],
      stars: 0,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.handleInit();
        firebase
          .firestore()
          .collection("users")
          .where("uid", "==", user.uid)
          .get()
          .then((snap) => {
            snap.forEach((doc) => {
              var wishlist = doc.data().wishlist;
              // productShow["isWished"] = false;
              wishlist.forEach((item) => {
                if (item === this.props.match.params.id3) {
                  this.setState({
                    isWished: true,
                  });
                }
              });
              this.setState({
                cart: doc.data().cart,
                currentUser: doc.data().email,
              });
            });
          });
      } else {
        this.handleInit();
        this.setState({
          cart: JSON.parse(localStorage.getItem("cart"))
            ? JSON.parse(localStorage.getItem("cart"))
            : [],
          currentUser: "",
        });
      }
    });
  }

  handleInit = () => {
    firebase
      .firestore()
      .collection("products")
      .onSnapshot((snap) => {
        var products = [];
        var productShow = {};
        var simProducts = [];
        var colors = [];
        snap.docChanges().forEach((changes) => {
          var p = changes.doc.data();
          p.id = changes.doc.id;
          products.push(p);
        });
        if (products.length === snap.size) {
          products.forEach(async (product) => {
            if (
              product.category.toLowerCase() ===
              this.props.match.params.id1.toLowerCase()
            ) {
              if (
                product.subCategory.toLowerCase() ===
                this.props.match.params.id2.toLowerCase()
              ) {
                if (product.id === this.props.match.params.id3) {
                  productShow = product;
                } else {
                  if (product.quantity !== 0) {
                    var sim = product.id;
                    simProducts.push(sim);
                  }
                }
              }
            }
          });
          products.forEach(async (product) => {
            if (
              product.category.toLowerCase() ===
              this.props.match.params.id1.toLowerCase()
            ) {
              if (
                product.subCategory.toLowerCase() ===
                this.props.match.params.id2.toLowerCase()
              ) {
                if (productShow.batch && product.batch === productShow.batch) {
                  colors.push(product);
                }
              }
            }
          });
          this.setState({
            product: productShow,
            simProducts: simProducts,
            colors: colors,
            loading: false,
          });
        }
      });
  };

  AddToCart = () => {
    // var concatinateQuantity = this.state.product;
    // concatinateQuantity.cartQuantity = this.state.usersQuantity;
    this.setState({
      addLoading: true,
    });
    if (firebase.auth().currentUser) {
      firebase
        .firestore()
        .collection("users")
        .where("uid", "==", firebase.auth().currentUser.uid)
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            var cart = doc.data().cart;
            var found = false;
            cart.forEach((item) => {
              if (item.id === this.state.product.id) {
                found = true;
              }
            });
            if (found === false) {
              var tempCart = {};
              tempCart.id = this.state.product.id;
              tempCart.quantity = this.state.usersQuantity;
              tempCart.size = this.state.sizeSelected;
              tempCart.max = this.state.product.max;
              cart.push(tempCart);
              console.log(cart);
              firebase
                .firestore()
                .collection("users")
                .doc(doc.id)
                .update({
                  cart: cart,
                })
                .then(() => {
                  toaster.notify("Added to cart");
                  this.setState({
                    addLoading: false,
                  });

                  this.removeFromWishlist(this.state.product.id);
                });
            } else {
              toaster.notify("Item already exist in your cart");
              this.setState({
                addLoading: false,
              });
            }
          });
        });
    } else {
      var cart = JSON.parse(localStorage.getItem("cart"))
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
      if (cart.length > 0) {
        cart.forEach((item) => {
          if (item.id !== this.state.product.id) {
            var tempCart = {};
            tempCart.id = this.state.product.id;
            tempCart.quantity = this.state.usersQuantity;
            tempCart.size = this.state.sizeSelected;
            tempCart.max = this.state.product.max;
            cart.push(tempCart);
            this.setState(
              {
                cart: cart,
                addloading: false,
              },
              () => {
                var localCart = JSON.stringify(this.state.cart);
                localStorage.setItem("cart", localCart);
                toaster.notify("Added to cart");
                this.props.handleParent();
              }
            );
          } else {
            toaster.notify("Item already exist in your cart");
            this.setState({
              addLoading: false,
            });
          }
        });
      } else {
        var tempCart = {};
        tempCart.id = this.state.product.id;
        tempCart.quantity = this.state.usersQuantity;
        tempCart.size = this.state.sizeSelected;
        tempCart.max = this.state.product.max;
        cart.push(tempCart);
        this.setState(
          {
            cart: cart,
            addloading: false,
          },
          () => {
            var localCart = JSON.stringify(this.state.cart);
            localStorage.setItem("cart", localCart);
            toaster.notify("Added to cart");
            this.props.handleParent();
          }
        );
      }
    }
  };

  addToWishlist = () => {
    firebase
      .firestore()
      .collection("users")
      .where("uid", "==", firebase.auth().currentUser.uid)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          var wishlist = doc.data().wishlist;
          var found = false;
          wishlist.forEach((item) => {
            if (item === this.state.product.id) {
              found = true;
            }
          });
          if (found === false) {
            this.setState({
              isWished: true,
            });
            wishlist.push(this.state.product.id);
            firebase
              .firestore()
              .collection("users")
              .doc(doc.id)
              .update({
                wishlist: wishlist,
              })
              .then(() => {
                toaster.notify("Added to your wishlist");
              });
          } else {
            toaster.notify("Item already exists in your wishlist");
          }
        });
      });
  };

  removeFromWishlist = () => {
    firebase
      .firestore()
      .collection("users")
      .where("uid", "==", firebase.auth().currentUser.uid)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          var wishlist = doc.data().wishlist;
          if (wishlist.length > 0) {
            var newwishlist = [];
            wishlist.map((item) => {
              if (item !== this.state.product.id) {
                newwishlist.push(item);
              }
            });
            this.setState({
              isWished: false,
            });
            firebase
              .firestore()
              .collection("users")
              .doc(doc.id)
              .update({
                wishlist: newwishlist,
              })
              .then(() => {
                toaster.notify(" Item removed from wishlist");
              });
          }
        });
      });
  };

  handlePlus = () => {
    var usersQuantity = this.state.usersQuantity;
    if (usersQuantity < this.state.product.max) {
      usersQuantity += 1;
      this.setState({
        usersQuantity,
      });
    }
  };

  handleMinus = () => {
    var usersQuantity = this.state.usersQuantity;
    if (usersQuantity > 1) {
      usersQuantity -= 1;
      this.setState({
        usersQuantity,
      });
    }
  };

  render() {
    var stars = 0;
    var review = 0;
    if (this.state.product.title) {
      this.state.product.ratings.map((rate) => {
        stars += rate.stars;
        if (rate.review.length > 0) {
          review += 1;
        }
      });
      stars = Math.round(stars / this.state.product.ratings.length);
    }
    return (
      <>
        {this.state.loading ? (
          <Loader />
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
                    <i className="fas fa-chevron-right"></i>
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
                    <i className="fas fa-chevron-right"></i>
                  </a>
                  <a
                    href={
                      "/Category/" +
                      this.props.match.params.id1 +
                      "/" +
                      this.props.match.params.id2 +
                      "/" +
                      this.state.product.id
                        ? this.state.product.id
                        : null
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {this.state.product.title
                      ? this.state.product.title
                      : "Not Found"}
                  </a>
                </div>
              </div>
            </div>
            <div className="product-container">
              {this.state.product.title ? (
                <div className="product-desc">
                  <div className="all-product-image">
                    <div className="carousal-section">
                      <div className="product-images">
                        {this.state.product.images &&
                          this.state.product.images.map((item, index) => (
                            <>
                              {this.state.activeImage === index ? (
                                <div
                                  className="preview-image activeImage"
                                  key={index}
                                >
                                  <img
                                    src={this.state.product.images[index]}
                                    alt="slider Images"
                                  />
                                </div>
                              ) : (
                                <div className="preview-image" key={index}>
                                  <img
                                    src={item}
                                    alt="slider Images"
                                    onClick={() => {
                                      this.setState({ activeImage: index });
                                    }}
                                  />
                                </div>
                              )}
                            </>
                          ))}
                      </div>

                      <div className="product-image">
                        {this.state.product.images ? (
                          <>
                            <div className="product-image-container">
                              <ReactImageMagnify
                                {...{
                                  className: "image-container",
                                  imageClassName: "product-image-image",
                                  enlargedImageContainerClassName:
                                    "product-zoom-container",
                                  enlargedImageClassName: "product-zoom-image",
                                  smallImage: {
                                    alt: "product image",
                                    isFluidWidth: true,
                                    src: this.state.product.images[
                                      this.state.activeImage
                                    ],
                                  },
                                  largeImage: {
                                    src: this.state.product.images[
                                      this.state.activeImage
                                    ],
                                    width: 1200,
                                    height: 1800,
                                  },
                                  lensStyle: { backgroundColor: "transparent" },
                                }}
                              />
                            </div>
                            <div className="product-image-container2">
                              <img
                                src={
                                  this.state.product.images[
                                    this.state.activeImage
                                  ]
                                }
                                alt=""
                              />
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="buying-options">
                      {this.state.product.quantity > 0 ? (
                        <>
                          <div className="option" onClick={this.AddToCart}>
                            <i className="fas fa-shopping-cart"></i>
                            <p>ADD TO CART</p>
                          </div>
                          <div
                            className="option"
                            onClick={() =>
                              (window.location.href =
                                "/Checkout/" +
                                this.state.product.id +
                                "/" +
                                this.state.usersQuantity)
                            }
                          >
                            <i className="fas fa-bolt"></i>
                            <p>BUY NOW</p>
                          </div>
                        </>
                      ) : (
                        <p className="outstock">OUT OF STOCK</p>
                      )}
                    </div>
                  </div>
                  <div className="description-section">
                    <div className="product-title">
                      <p>{this.state.product.title}</p>
                      {this.state.currentUser.length > 0 ? (
                        <>
                          {this.state.isWished ? (
                            <div
                              className="circle"
                              onClick={this.removeFromWishlist}
                            >
                              <i className="red fa fa-heart"></i>
                            </div>
                          ) : (
                            <div
                              className="circle"
                              onClick={this.addToWishlist}
                            >
                              <i className="fa fa-heart"></i>
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                    <div className="price">
                      <div className="product-price">
                        &#8377;{this.state.product.sp}
                      </div>
                      <div className="product-price-linethrough">
                        &#8377;{this.state.product.cp}
                      </div>
                      <div className="product-discount">
                        {100 -
                          Math.round(
                            (this.state.product.sp / this.state.product.cp) *
                              100
                          )}
                        % off
                      </div>
                    </div>
                    <div className="other-details">
                      {this.state.product.quantity > 0 ? (
                        <>
                          <div className="quantity-cont">
                            <p className="title-tag">Quantity</p>
                            <div className="quantity">
                              {this.state.usersQuantity === 1 ? (
                                <span className="symbol grey">-</span>
                              ) : (
                                <span
                                  className="symbol"
                                  onClick={this.handleMinus}
                                >
                                  -
                                </span>
                              )}
                              <span>{this.state.usersQuantity}</span>
                              {this.state.usersQuantity ===
                              parseInt(this.state.product.max) ? (
                                <span className="symbol grey">+</span>
                              ) : (
                                <span
                                  className="symbol"
                                  onClick={this.handlePlus}
                                >
                                  +
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="size-cont">
                            <p className="title-tag">Size</p>
                            <div className="size">
                              <p
                                className={
                                  this.state.sizeSelected === "XS"
                                    ? "sizeSelected"
                                    : null
                                }
                                onClick={() => {
                                  this.setState({ sizeSelected: "XS" });
                                }}
                              >
                                XS
                              </p>
                              <p
                                className={
                                  this.state.sizeSelected === "S"
                                    ? "sizeSelected"
                                    : null
                                }
                                onClick={() => {
                                  this.setState({ sizeSelected: "S" });
                                }}
                              >
                                S
                              </p>
                              <p
                                className={
                                  this.state.sizeSelected === "M"
                                    ? "sizeSelected"
                                    : null
                                }
                                onClick={() => {
                                  this.setState({ sizeSelected: "M" });
                                }}
                              >
                                M
                              </p>
                              <p
                                className={
                                  this.state.sizeSelected === "L"
                                    ? "sizeSelected"
                                    : null
                                }
                                onClick={() => {
                                  this.setState({ sizeSelected: "L" });
                                }}
                              >
                                L
                              </p>
                              <p
                                className={
                                  this.state.sizeSelected === "XL"
                                    ? "sizeSelected"
                                    : null
                                }
                                onClick={() => {
                                  this.setState({ sizeSelected: "XL" });
                                }}
                              >
                                XL
                              </p>
                            </div>
                          </div>
                          {this.state.colors.length > 1 ? (
                            <div className="color-cont">
                              <p className="title-tag">Color</p>
                              <div className="colors">
                                {this.state.colors.map((color) => {
                                  return (
                                    <Link
                                      className={
                                        color.color === this.state.product.color
                                          ? "color color-selected"
                                          : "color"
                                      }
                                      to={
                                        "/Category/" +
                                        this.props.match.params.id1 +
                                        "/" +
                                        this.props.match.params.id2 +
                                        "/" +
                                        color.id
                                      }
                                    >
                                      <img src={color.images[0]} alt="" />
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <div className="out-of-stock-text">
                          <h1>Sold Out</h1>
                          <p>This item is currently out of stock</p>
                        </div>
                      )}
                    </div>
                    <div className="product-details">
                      <h3>Product Details</h3>
                      <p className="product-summary">
                        {this.state.product.description}
                      </p>
                      <ul>
                        <li>
                          <p className="darkgrey">Height</p>
                          <p className="text">{this.state.product.height}</p>
                        </li>
                        <li>
                          <p className="darkgrey">Width</p>
                          <p className="text">{this.state.product.width}</p>
                        </li>
                        <li>
                          <p className="darkgrey">Thickness</p>
                          <p className="text">{this.state.product.thick}</p>
                        </li>
                        {this.state.product.specifications &&
                          this.state.product.specifications.map((spec) => (
                            <li>
                              <p className="darkgrey">{spec.title}</p>
                              <p className="text">{spec.content}</p>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className="rating">
                      <div className="rating-header">
                        <h3>Ratings & Review</h3>
                        {this.state.product.ratings.length > 0 ? (
                          <div className="rating-body">
                            <div className="stars">
                              <p>{stars}</p>
                              <i className="fas fa-star"></i>
                            </div>
                            <p className="rating-size">
                              {this.state.product.ratings.length} ratings{" "}
                              {review > 0 ? "& " + review + " reviews" : null}
                            </p>
                          </div>
                        ) : null}
                      </div>
                      <div className="review-list">
                        {this.state.product.ratings.length > 0 ? (
                          this.state.product.ratings.map((rating) => {
                            return (
                              <div className="reviews">
                                <div className="upper">
                                  <div className="stars-mini">
                                    <p>{rating.stars}</p>
                                    <i className="fas fa-star"></i>
                                  </div>
                                  <p className="review-text">{rating.review}</p>
                                </div>
                                <div className="lower">
                                  <p className="user-name">{rating.name}</p>
                                  <p className="date">
                                    {moment(
                                      rating.date.toDate(),
                                      "YYYYMMDD"
                                    ).fromNow()}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="noratings">
                            <p>No ratings or reviews</p>
                          </div>
                        )}
                      </div>
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
            </div>
            {this.state.simProducts.length > 0 ? (
              <>
                <div className="product-like">
                  <Slider
                    data={this.state.simProducts}
                    title={this.state.sliderTitle}
                    view={false}
                  />
                </div>
                <div className="buying-options-sticky">
                  {this.state.product.quantity > 0 ? (
                    <>
                      <div className="option" onClick={this.AddToCart}>
                        <i className="fas fa-shopping-cart"></i>
                        <p>ADD TO CART</p>
                      </div>
                      <div
                        className="option"
                        onClick={() =>
                          (window.location.href =
                            "/Checkout/" +
                            this.state.product.id +
                            "/" +
                            this.state.usersQuantity)
                        }
                      >
                        <i className="fas fa-bolt"></i>
                        <p>BUY NOW</p>
                      </div>
                    </>
                  ) : (
                    <p className="outstock">OUT OF STOCK</p>
                  )}
                </div>
              </>
            ) : null}
          </motion.div>
        )}
      </>
    );
  }
}

import React from "react";
import "./productDescription.style.css";
import Slider from "../../../Components/Slider/Slider";
import { motion } from "framer-motion";
import Lottie from "lottie-react-web";
import loading from "../../../../assets/loading.json";
import toaster from "toasted-notes";
import ReactImageMagnify from "react-image-magnify";
import firebase from "firebase";

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
      viewAll: false,
      activeImage: 0,
      isWished: false,
      cart: [],
      product: [],
      simProducts: [],
      sizeSelected: 1,
      usersQuantity: 1,
      currentUser: "",
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("products")
      .get()
      .then((snap) => {
        var products = [];
        snap.forEach((doc) => {
          var p = doc.data();
          p.id = doc.id;
          products.push(p);
          var productShow = [];
          var simProducts = [];
          products.forEach((product) => {
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
                  var sim = product;
                  simProducts.push(sim);
                }
              }
            }
          });
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              firebase
                .firestore()
                .collection("users")
                .where("email", "==", user.email)
                .onSnapshot((snap) => {
                  snap.docChanges().forEach((change) => {
                    var wishlist = change.doc.data().wishlist;
                    // productShow["isWished"] = false;
                    wishlist.forEach((item) => {
                      if (item === this.state.product.id) {
                        this.setState({
                          isWished: true,
                        });
                      }
                    });
                    this.setState({
                      product: productShow,
                      simProducts: simProducts,
                      loading: false,
                      cart: change.doc.data().cart,
                      currentUser: user.email,
                    });
                  });
                });
            } else {
              this.setState({
                product: productShow,
                simProducts: simProducts,
                loading: false,
                cart: JSON.parse(localStorage.getItem("cart"))
                  ? JSON.parse(localStorage.getItem("cart"))
                  : [],
                currentUser: "",
              });
            }
          });
        });
      });
  }

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
        .where("email", "==", firebase.auth().currentUser.email)
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
              cart.push(tempCart);
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
          }
        );
      }
    }
  };

  addToWishlist = () => {
    firebase
      .firestore()
      .collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
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
      .where("email", "==", firebase.auth().currentUser.email)
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
    usersQuantity += 1;
    this.setState({
      usersQuantity,
    });
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
                      this.props.match.params.id3
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {this.props.match.params.id3}
                  </a>
                </div>
              </div>
            </div>
            <div className="product-container">
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
                                  src={this.state.product.images[0]}
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
                        <div className="product-image-container">
                          <ReactImageMagnify
                            {...{
                              className: "product-image-container",
                              imageClassName: "product-image-image",
                              enlargedImageContainerClassName:
                                "product-zoom-container",
                              enlargedImageClassName: "product-zoom-image",
                              smallImage: {
                                alt: "Wristwatch by Ted Baker London",
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
                      ) : null}
                    </div>
                  </div>
                  <div className="buying-options">
                    <div className="option" onClick={this.AddToCart}>
                      <i className="fas fa-shopping-cart"></i>
                      <p>ADD TO CART</p>
                    </div>
                    <div className="option">
                      <i className="fas fa-bolt"></i>
                      <p>BUY NOW</p>
                    </div>
                  </div>
                </div>
                <div className="description-section">
                  <div className="product-title">
                    <p>Men's Sling Bag</p>
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
                          <div className="circle" onClick={this.addToWishlist}>
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
                          (this.state.product.sp / this.state.product.cp) * 100
                        )}
                      % off
                    </div>
                  </div>
                  <div className="other-details">
                    <div className="quantity-cont">
                      <p className="title-tag">Quantity</p>
                      <div className="quantity">
                        <span className="symbol" onClick={this.handleMinus}>
                          -
                        </span>
                        <span>{this.state.usersQuantity}</span>
                        <span className="symbol" onClick={this.handlePlus}>
                          +
                        </span>
                      </div>
                    </div>
                    <div className="size-cont">
                      <p className="title-tag">Size</p>
                      <div className="size">
                        <p
                          className={
                            this.state.sizeSelected === 1
                              ? "sizeSelected"
                              : null
                          }
                          onClick={() => {
                            this.setState({ sizeSelected: 1 });
                          }}
                        >
                          XS
                        </p>
                        <p
                          className={
                            this.state.sizeSelected === 2
                              ? "sizeSelected"
                              : null
                          }
                          onClick={() => {
                            this.setState({ sizeSelected: 2 });
                          }}
                        >
                          S
                        </p>
                        <p
                          className={
                            this.state.sizeSelected === 3
                              ? "sizeSelected"
                              : null
                          }
                          onClick={() => {
                            this.setState({ sizeSelected: 3 });
                          }}
                        >
                          M
                        </p>
                        <p
                          className={
                            this.state.sizeSelected === 4
                              ? "sizeSelected"
                              : null
                          }
                          onClick={() => {
                            this.setState({ sizeSelected: 4 });
                          }}
                        >
                          L
                        </p>
                        <p
                          className={
                            this.state.sizeSelected === 5
                              ? "sizeSelected"
                              : null
                          }
                          onClick={() => {
                            this.setState({ sizeSelected: 5 });
                          }}
                        >
                          XL
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="product-details">
                    <h3>Product Details</h3>
                    <p className="product-summary">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Veniam doloremque quia quo sit nulla soluta nemo rerum
                      aliquam maiores dolor odit animi eligendi ipsam qui
                      officiis consectetur aliquid, quae repellat dolores enim.
                      Fugiat minima accusamus quis vitae quibusdam adipisci
                      laborum eum corrupti dolores ab porro qui, voluptatem
                      asperiores distinctio voluptatum!
                    </p>
                    <ul>
                      <li>
                        <p className="darkgrey">Number of Contents</p>
                        <p className="text">1 backpack</p>
                      </li>
                      <li>
                        <p className="darkgrey">Number of Contents</p>
                        <p className="text">1 backpack</p>
                      </li>
                      <li>
                        <p className="darkgrey">Number of Contents</p>
                        <p className="text">1 backpack</p>
                      </li>
                      <li>
                        <p className="darkgrey">Number of Contents</p>
                        <p className="text">1 backpack</p>
                      </li>
                      <li>
                        <p className="darkgrey">Number of Contents</p>
                        <p className="text">1 backpack</p>
                      </li>
                      <li>
                        <p className="darkgrey">Number of Contents</p>
                        <p className="text">1 backpack</p>
                      </li>
                      <li>
                        <p className="darkgrey">Number of Contents</p>
                        <p className="text">1 backpack</p>
                      </li>
                      <li>
                        <p className="darkgrey">Number of Contents</p>
                        <p className="text">1 backpack</p>
                      </li>
                    </ul>
                  </div>
                  <div className="rating">
                    <div className="rating-header">
                      <h3>Ratings & Review</h3>
                      <div className="stars">
                        <p>5</p>
                        <i className="fas fa-star"></i>
                      </div>
                      <p className="rating-size">38 ratings & 9 reviews</p>
                    </div>
                    <div className="review-list">
                      <div className="reviews">
                        <div className="upper">
                          <div className="stars-mini">
                            <p>3</p>
                            <i className="fas fa-star"></i>
                          </div>
                          <p className="review-text">
                            This is an amazing and wonderful product.
                          </p>
                        </div>
                        <div className="lower">
                          <p className="user-name">Anas Alam</p>
                          <p className="date">6 months ago</p>
                        </div>
                      </div>
                      <div className="reviews">
                        <div className="upper">
                          <div className="stars-mini">
                            <p>3</p>
                            <i className="fas fa-star"></i>
                          </div>
                          <p className="review-text">
                            This is an amazing and wonderful product.
                          </p>
                        </div>
                        <div className="lower">
                          <p className="user-name">Anas Alam</p>
                          <p className="date">6 months ago</p>
                        </div>
                      </div>
                      <div className="reviews">
                        <div className="upper">
                          <div className="stars-mini">
                            <p>3</p>
                            <i className="fas fa-star"></i>
                          </div>
                          <p className="review-text">
                            This is an amazing and wonderful product.
                          </p>
                        </div>
                        <div className="lower">
                          <p className="user-name">Anas Alam</p>
                          <p className="date">6 months ago</p>
                        </div>
                      </div>
                      <div className="reviews">
                        <div className="upper">
                          <div className="stars-mini">
                            <p>3</p>
                            <i className="fas fa-star"></i>
                          </div>
                          <p className="review-text">
                            This is an amazing and wonderful product.
                          </p>
                        </div>
                        <div className="lower">
                          <p className="user-name">Anas Alam</p>
                          <p className="date">6 months ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {this.state.simProducts.length > 0 ? (
              <div className="product-like">
                <Slider
                  data={this.state.simProducts}
                  title={this.state.sliderTitle}
                  view={this.state.viewAll}
                />
              </div>
            ) : null}
          </motion.div>
        )}
      </>
    );
  }
}

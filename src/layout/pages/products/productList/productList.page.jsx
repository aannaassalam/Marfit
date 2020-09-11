import React from "react";
import { motion } from "framer-motion";
import "./productList.style.css";

import filter from "./assets/filter.png";
import Filter from "../../../Components/filter/filter.component";
import Card from "../../../Components/Card/Card";
import firebase from "firebase";
import Lottie from "lottie-react-web";
import loading from "../../../../assets/loading.json";
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

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      productList: [],
      category: [],
      filterProductList: [],
      type: [],
      outStock: false,
      loading: true,
      month: 3,
      min: 100,
      max: 5000,
    };
  }
  componentDidMount() {
    firebase
      .firestore()
      .collection("products")
      .onSnapshot((snap) => {
        var productList = [];
        snap.docChanges().forEach((change) => {
          if (
            this.props.match.params.id1 === change.doc.data().category &&
            this.props.match.params.id2 === change.doc.data().subCategory
          ) {
            var product = change.doc.data();
            product.id = change.doc.id;
            productList.push(product);
          }
        });
        if (firebase.auth().currentUser) {
          firebase
            .firestore()
            .collection("users")
            .where("email", "==", firebase.auth().currentUser.email)
            .onSnapshot((snap) => {
              snap.docChanges().forEach((change) => {
                var wishlist = [];
                var filterProductList = [];
                wishlist = change.doc.data().wishlist;
                productList.map((product) => {
                  if (
                    product.category.toLowerCase() ===
                      this.props.match.params.id1.toLowerCase() &&
                    product.subCategory.toLowerCase() ===
                      this.props.match.params.id2.toLowerCase()
                  ) {
                    filterProductList.push(product);
                  }
                });
                filterProductList.map((item) => {
                  var found = false;
                  wishlist.map((i) => {
                    if (item.email === i.email && item.id === i.id) {
                      item["isWished"] = true;
                      found = true;
                    }
                  });
                  if (found === false) {
                    item["isWished"] = false;
                  }
                });
                this.setState(
                  {
                    productList: filterProductList,
                    filterProductList: filterProductList,
                    loading: false,
                  },
                  () => {
                    this.handleProductInStock();
                  }
                );
              });
            });
        } else {
          this.setState(
            {
              productList: productList,
              loading: false,
            },
            () => {
              this.handleProductInStock();
            }
          );
        }
      });
    firebase
      .firestore()
      .collection("settings")
      .onSnapshot((snap) => {
        snap.docChanges().forEach((change) => {
          var categories = change.doc.data().categories;
          categories.map((cat) => {
            if (
              cat.name.toLowerCase() ===
              this.props.match.params.id1.toLowerCase()
            ) {
              this.setState(
                {
                  category: cat,
                },
                () => {}
              );
            }
          });
        });
      });
  }

  handleMonths = (e) => {
    var products = this.state.productList;
    var newproducts = [];
    products.map((product) => {
      if (product.max >= e) {
        newproducts.push(product);
      }
    });
    this.setState({
      filterProductList: newproducts,
      month: e,
    });
  };

  handleProductAddType = (e) => {
    var products = this.state.productList;
    var type = this.state.type;
    type.push(e);
    this.setState(
      {
        type: type,
      },
      () => {
        var newproducts = [];
        products.map((product) => {
          if (this.state.type.includes(product.tag)) {
            newproducts.push(product);
          }
        });
        this.setState({
          filterProductList: newproducts,
        });
      }
    );
  };

  handleProductRemoveType = (e) => {
    var products = this.state.productList;
    var type = this.state.type;
    var type2 = [];
    type.map((t) => {
      if (t !== e) {
        type2.push(t);
      }
    });
    this.setState(
      {
        type: type2,
      },
      () => {
        if (this.state.type.length !== 0) {
          var newproducts = [];
          products.map((product) => {
            if (this.state.type.includes(product.tag)) {
              newproducts.push(product);
            }
          });
          this.setState({
            filterProductList: newproducts,
          });
        } else {
          this.setState({
            filterProductList: products,
          });
        }
      }
    );
  };

  handleRentRange = (min, max) => {
    var products = this.state.productList;
    var newproducts = [];
    products.map((product) => {
      if (product.sp >= min && product.sp <= max) {
        newproducts.push(product);
      }
    });
    this.setState({
      filterProductList: newproducts,
      min: min,
      max: max,
    });
  };

  handleProductOutStock = () => {
    var products = this.state.productList;
    var newproducts = [];
    products.map((product) => {
      if (product.quantity >= 0) {
        newproducts.push(product);
      }
    });
    this.setState({
      filterProductList: newproducts,
      outStock: true,
    });
  };

  handleProductInStock = () => {
    var products = this.state.productList;
    var newproducts = [];
    products.map((product) => {
      if (product.quantity > 0) {
        newproducts.push(product);
      }
    });
    this.setState({
      filterProductList: newproducts,
      outStock: false,
    });
  };

  handleReset = () => {
    this.setState({
      filterProductList: this.state.productList,
      outStock: false,
      type: [],
      month: 3,
      min: 100,
      max: 5000,
    });
  };

  addToWishlist = (e) => {
    if (firebase.auth().currentUser) {
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
    } else {
      toast.error("Please Log in");
    }
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
            <ToastContainer />
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="productlist-container"
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
                  </div>

                  <div className="bd-menu-stats">
                    {this.props.match.params.id2 ? (
                      <p>
                        We have total {this.state.productList.length} products
                        under <b>{this.props.match.params.id2}</b> category
                      </p>
                    ) : (
                      <p>
                        We have total {this.state.productList.length} products
                        under <b>{this.props.match.params.id1}</b> category
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* filter header */}
              {this.state.productList.length === 0 ? (
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
              ) : (
                <>
                  <div className="filter-header">
                    <div className="left">
                      <div className="filter">
                        <img src={filter} alt="filter-logo" />
                        <p>Filters</p>
                      </div>
                      <div className="reset">
                        <button onClick={this.handleReset}>Reset</button>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="right"></div>
                  </div>

                  {/* Product List catalogue */}
                  <div className="catalogue">
                    <Filter
                      handleMonths={(e) => this.handleMonths(e)}
                      category={this.state.category}
                      subCat={this.props.match.params.id2}
                      type={this.state.type}
                      handleProductAddType={(e) => this.handleProductAddType(e)}
                      handleProductRemoveType={(e) =>
                        this.handleProductRemoveType(e)
                      }
                      handleRentRange={(min, max) =>
                        this.handleRentRange(min, max)
                      }
                      handleProductInStock={this.handleProductInStock}
                      handleProductOutStock={this.handleProductOutStock}
                      outStock={this.state.outStock}
                      min={this.state.min}
                      max={this.state.max}
                      month={this.state.month}
                    />
                    <div className="card-list-container">
                      <div className="card-list">
                        {this.state.filterProductList.length > 0 ? (
                          <>
                            {this.state.filterProductList.map((item, index) => {
                              return (
                                <Card
                                  id1={this.props.match.params.id1}
                                  id2={this.props.match.params.id2}
                                  item={item}
                                  addToWishlist={(e) => this.addToWishlist(e)}
                                  removeFromWishlist={(e) =>
                                    this.removeFromWishlist(e)
                                  }
                                  key={index}
                                />
                              );
                            })}
                          </>
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
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </>
    );
  }
}

export default ProductList;

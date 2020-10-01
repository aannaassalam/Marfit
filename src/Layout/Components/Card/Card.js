import React from "react";
import "./Card.css";
import firebase from "firebase";
import toaster from "toasted-notes";
import Order from "../../Pages/Order/order";
import { Link } from "react-router-dom";
import { cssNumber } from "jquery";

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: [],
      loading: true,
      isWished: false,
      currentUser: "",
      orderDetail: false,
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("products")
      .doc(this.props.item.id)
      .onSnapshot((product) => {
        if (product.exists) {
          var p = product.data();
          p.id = product.id;
          this.setState(
            {
              item: p,
              loading: false,
            },
            () => {
              firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                  firebase
                    .firestore()
                    .collection("users")
                    .where("email", "==", user.email)
                    .get()
                    .then((snap) =>
                      snap.forEach((doc) => {
                        var wishlist = doc.data().wishlist;
                        var currentUser = {};
                        currentUser.email = user.email;
                        currentUser.id = doc.id;
                        this.setState({
                          currentUser: currentUser
                        })
                        wishlist.forEach((item) => {
                          if (item === this.state.item.id) {
                            this.setState({
                              isWished: true,
                            });
                          }
                        });
                      })
                    );
                } else {
                  this.setState({ currentUser: "" });
                }
              });
            }
          );
        }
      });
  }

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
            if (item === this.state.item.id) {
              found = true;
            }
          });
          if (found === false) {
            this.setState({
              isWished: true,
            });
            wishlist.push(this.state.item.id);
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
              if (item !== this.state.item.id) {
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
                toaster.notify(" Item removed from your wishlist");
                this.setState({
                  isWished: false,
                });
              });
          }
        });
      });
  };

  render() {
    var percent = Math.round((this.state.item.sp / this.state.item.cp) * 100);
    return (
      <div className="card-cont">
        {this.state.loading ? (
          <h1>loading</h1>
        ) : (
          <>
            <div className="img-container">
              <a
                style={{ width: "100%", height: "100%" }}
                href={
                  "/Category/" +
                  this.props.id1 +
                  "/" +
                  this.props.id2 +
                  "/" +
                  this.state.item.title
                }
              >
                <img src={this.state.item.images[0]} alt="Bag-Icon" />
              </a>
            </div>
            {this.state.currentUser && this.state.currentUser.email.length > 0 ? (
              <>
                {this.state.isWished ? (
                  <div
                    className="circle"
                    onClick={() => this.removeFromWishlist(this.state.item.id)}
                  >
                    <i className="red fa fa-heart"></i>
                  </div>
                ) : (
                  <div
                    className="circle"
                    onClick={() => this.addToWishlist(this.state.item.id)}
                  >
                    <i className="fa fa-heart"></i>
                  </div>
                )}
              </>
            ) : null}

            <a
              href={
                "/Category/" +
                this.props.id1 +
                "/" +
                this.props.id2 +
                "/" +
                this.props.item.title
              }
              className="short-description"
            >
              <p className="item-title">{this.state.item.title}</p>
              <p className="item-price">&#8377;{this.state.item.sp}</p>
              <div className="price-flex">
                <p className="price-line-through">
                  &#8377;{this.state.item.cp}
                </p>
                <p className="discount">{100 - percent}% off</p>
              </div>
            </a>
          </>
        )}
      </div>
    );
  }
}
